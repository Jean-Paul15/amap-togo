'use server'

import { createClientServer } from '@amap-togo/database/server'
import { revalidatePath } from 'next/cache'

export async function getProductsForAdmin() {
    const supabase = await createClientServer()
    const { data } = await supabase
        .from('produits')
        .select('id, nom, prix, unite, stock, image_url')
        .eq('actif', true)
        .order('nom')
    return data || []
}

export async function getUsersForAdmin() {
    const supabase = await createClientServer()
    const { data } = await supabase
        .from('profils')
        .select('id, nom, prenom, email, telephone')
        .order('nom')
    return data || []
}

export async function createAdminOrder(data: {
    clientId: string | null
    clientInfo?: { nom: string; prenom: string; telephone: string; quartier: string; adresse?: string }
    items: { id: string; quantite: number; prix: number }[]
    notes?: string
    whatsappText?: string
}) {
    const supabase = await createClientServer()

    try {
        // Calcul total
        const montantTotal = data.items.reduce((sum, item) => sum + (item.prix * item.quantite), 0)

        // Créer la commande
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: commande, error: cmdError } = await (supabase as any)
            .from('commandes')
            .insert({
                client_id: data.clientId || null, // Convertir chaîne vide en null
                montant_total: montantTotal,
                statut: 'en_attente',
                statut_paiement: 'en_attente',
                notes: data.whatsappText ? `[Import WhatsApp]\n${data.whatsappText}\n\n${data.notes || ''}` : data.notes,
                // Si client anonyme
                adresse_livraison: data.clientInfo?.adresse,
                quartier_livraison: data.clientInfo?.quartier,
                telephone_livraison: data.clientInfo?.telephone,
                // Pour les clients anonymes, on stocke souvent dans une colonne JSON ou sépare, 
                // ici on assume qu'on utilise les colonnes existantes ou client_id
            })
            .select()
            .single()

        if (cmdError) throw cmdError

        // Lignes
        if (data.items.length > 0) {
            const lignes = data.items.map(item => ({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                commande_id: (commande as any).id,
                produit_id: item.id,
                quantite: item.quantite,
                prix_unitaire: item.prix,
                prix_total: item.prix * item.quantite
            }))

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: linesError } = await (supabase as any)
                .from('commandes_lignes')
                .insert(lignes)

            if (linesError) throw linesError
        }

        // Créer entrée paiement
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('paiements').insert({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            commande_id: (commande as any).id,
            montant: montantTotal,
            methode: 'especes', // Défaut
            statut: 'en_attente'
        })

        revalidatePath('/(admin)/commandes')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { success: true, id: (commande as any).id, numero: (commande as any).numero }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Erreur createAdminOrder:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Update order status and auto-sync to financial system if confirmed
 */
export async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = await createClientServer()

    try {
        // Get order details before update
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: order, error: fetchError } = await (supabase as any)
            .from('commandes')
            .select('*, financial_record_id')
            .eq('id', orderId)
            .single()

        if (fetchError) throw fetchError

        // Update order status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
            .from('commandes')
            .update({ statut: newStatus })
            .eq('id', orderId)

        if (updateError) throw updateError

        // Auto-sync to financial system if confirmed and not already synced
        if ((newStatus === 'confirmee' || newStatus === 'livree') && !order.financial_record_id) {
            // Import sync function
            const { syncOrderToFinancial } = await import('./order-financial-sync')
            const syncResult = await syncOrderToFinancial(orderId)

            if (syncResult.error) {
                console.warn('Failed to auto-sync order to financial:', syncResult.error)
                // Don't fail the status update if sync fails
            }
        }

        // If order is cancelled and was synced, create reversal
        if (newStatus === 'annulee' && order.financial_record_id) {
            const { unsyncOrder } = await import('./order-financial-sync')
            await unsyncOrder(orderId, true)
        }

        revalidatePath('/(admin)/commandes')
        revalidatePath('/gestion')

        return { success: true }
    } catch (error: any) {
        console.error('Error updating order status:', error)
        return { success: false, error: error.message }
    }
}

