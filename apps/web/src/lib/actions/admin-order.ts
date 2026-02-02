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
        const { data: commande, error: cmdError } = await (supabase as any)
            .from('commandes')
            .insert({
                client_id: data.clientId,
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
                commande_id: commande.id,
                produit_id: item.id,
                quantite: item.quantite,
                prix_unitaire: item.prix,
                prix_total: item.prix * item.quantite
            }))

            const { error: linesError } = await (supabase as any)
                .from('commandes_lignes')
                .insert(lignes)

            if (linesError) throw linesError
        }

        // Créer entrée paiement
        await (supabase as any).from('paiements').insert({
            commande_id: commande.id,
            montant: montantTotal,
            methode: 'especes', // Défaut
            statut: 'en_attente'
        })

        revalidatePath('/(admin)/commandes')
        return { success: true, id: commande.id, numero: commande.numero }
    } catch (error: any) {
        console.error('Erreur createAdminOrder:', error)
        return { success: false, error: error.message }
    }
}
