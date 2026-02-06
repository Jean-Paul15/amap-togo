// Order-Financial Synchronization Functions
// Automatically creates financial records when orders are confirmed

'use server'

import { createClientServer } from '@amap-togo/database/server'
import { revalidatePath } from 'next/cache'

export interface OrderSyncData {
    orderId: string
    total: number
    clientName: string
    createdAt: string
}

/**
 * Creates a financial record from an order
 * Called automatically when order is confirmed
 */
export async function createFinancialRecordFromOrder(data: OrderSyncData) {
    const supabase = await createClientServer()

    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { error: 'Non authentifié' }
        }

        // Create financial record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: financialRecord, error: financialError } = await (supabase as any)
            .from('financial_records')
            .insert({
                date: data.createdAt,
                description: `Commande #${data.orderId.slice(0, 8)} - ${data.clientName}`,
                montant: data.total,
                type: 'recette',
                categorie: 'Ventes',
                commande_id: data.orderId,
            })
            .select()
            .single()

        if (financialError) {
            console.error('Error creating financial record:', financialError)
            return { error: financialError.message }
        }

        // Update order with financial_record_id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: orderError } = await (supabase as any)
            .from('commandes')
            .update({ financial_record_id: financialRecord.id })
            .eq('id', data.orderId)

        if (orderError) {
            console.error('Error updating order:', orderError)
            // Rollback: delete the financial record
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
                .from('financial_records')
                .delete()
                .eq('id', financialRecord.id)
            return { error: orderError.message }
        }

        revalidatePath('/gestion')
        revalidatePath('/commandes')

        return { data: financialRecord }
    } catch (error: any) {
        console.error('Sync error:', error)
        return { error: error.message || 'Erreur lors de la synchronisation' }
    }
}

/**
 * Syncs an existing order to financial system
 * Used for manual sync or bulk migration
 */
export async function syncOrderToFinancial(orderId: string) {
    const supabase = await createClientServer()

    try {
        // Get order details
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: order, error: orderError } = await (supabase as any)
            .from('commandes')
            .select('*')
            .eq('id', orderId)
            .single()

        if (orderError || !order) {
            return { error: 'Commande introuvable' }
        }

        // Check if already synced
        if (order.financial_record_id) {
            return { error: 'Commande déjà synchronisée' }
        }

        // Only sync confirmed orders
        if (order.statut !== 'confirmee' && order.statut !== 'livree') {
            return { error: 'Seules les commandes confirmées peuvent être synchronisées' }
        }

        // Create financial record
        return await createFinancialRecordFromOrder({
            orderId: order.id,
            total: order.montant_total || 0,
            clientName: order.telephone_livraison || 'Client',
            createdAt: order.created_at,
        })
    } catch (error: any) {
        console.error('Sync error:', error)
        return { error: error.message || 'Erreur lors de la synchronisation' }
    }
}

/**
 * Removes sync between order and financial record
 * Used when order is cancelled
 */
export async function unsyncOrder(orderId: string, createReversal: boolean = true) {
    const supabase = await createClientServer()

    try {
        // Get order with financial record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: order, error: orderError } = await (supabase as any)
            .from('commandes')
            .select('*, financial_records(*)')
            .eq('id', orderId)
            .single()

        if (orderError || !order) {
            return { error: 'Commande introuvable' }
        }

        if (!order.financial_record_id) {
            return { error: 'Commande non synchronisée' }
        }

        if (createReversal && order.financial_records) {
            // Create reversal entry (negative)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
                .from('financial_records')
                .insert({
                    date: new Date().toISOString(),
                    description: `Annulation commande #${orderId.slice(0, 8)} - ${order.telephone_livraison}`,
                    montant: order.montant_total || 0,
                    type: 'depense',
                    categorie: 'Annulations',
                    commande_id: orderId,
                })
        }

        // Remove link from order
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
            .from('commandes')
            .update({ financial_record_id: null })
            .eq('id', orderId)

        if (updateError) {
            return { error: updateError.message }
        }

        revalidatePath('/gestion')
        revalidatePath('/commandes')

        return { success: true }
    } catch (error: any) {
        console.error('Unsync error:', error)
        return { error: error.message || 'Erreur lors de la désynchronisation' }
    }
}

/**
 * Gets all unsynced confirmed orders
 * Used for bulk migration tool
 */
export async function getUnsyncedOrders() {
    const supabase = await createClientServer()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('commandes')
            .select('*')
            .is('financial_record_id', null)
            .in('statut', ['confirmee', 'livree'])
            .order('created_at', { ascending: false })

        if (error) {
            return { error: error.message }
        }

        return { data: data || [] }
    } catch (error: any) {
        return { error: error.message || 'Erreur lors de la récupération' }
    }
}

/**
 * Bulk sync multiple orders
 * Used for migrating old orders
 */
export async function bulkSyncOrders(orderIds: string[]) {
    const results = {
        success: [] as string[],
        errors: [] as { orderId: string; error: string }[],
    }

    for (const orderId of orderIds) {
        const result = await syncOrderToFinancial(orderId)
        if (result.error) {
            results.errors.push({ orderId, error: result.error })
        } else {
            results.success.push(orderId)
        }
    }

    revalidatePath('/gestion')
    revalidatePath('/commandes')

    return results
}
