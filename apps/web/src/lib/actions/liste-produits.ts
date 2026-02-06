'use server'

import { createClientServer } from '@amap-togo/database/server'
import { revalidatePath } from 'next/cache'

export interface ListeProduits {
    id: string
    contenu: string
    date_publication: string
    actif: boolean
    created_by: string | null
    created_at: string
    updated_at: string
}

export interface CreateListeProduitsData {
    contenu: string
    actif?: boolean
}

/**
 * Get the active weekly products list (for public display)
 */
export async function getActiveListeProduits(): Promise<ListeProduits | null> {
    const supabase = await createClientServer()

    const { data, error } = await (supabase as any)
        .from('liste_produits_semaine')
        .select('*')
        .eq('actif', true)
        .single()

    if (error) {
        console.error('Error fetching active liste:', error)
        return null
    }

    return data
}

/**
 * Get all weekly products lists (admin only)
 */
export async function getAllListesProduits(): Promise<ListeProduits[]> {
    const supabase = await createClientServer()

    const { data, error } = await (supabase as any)
        .from('liste_produits_semaine')
        .select('*')
        .order('date_publication', { ascending: false })

    if (error) {
        console.error('Error fetching all listes:', error)
        return []
    }

    return data || []
}

/**
 * Create a new weekly products list (admin only)
 * Automatically deactivates other lists if this one is active
 */
export async function createListeProduits(listeData: CreateListeProduitsData) {
    const supabase = await createClientServer()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Non authentifié' }
    }

    const { data, error } = await (supabase as any)
        .from('liste_produits_semaine')
        .insert({
            contenu: listeData.contenu,
            actif: listeData.actif ?? true,
            created_by: user.id,
        } as any)
        .select()
        .single()

    if (error) {
        console.error('Error creating liste:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/liste-semaine')

    return { data }
}

/**
 * Update an existing weekly products list (admin only)
 */
export async function updateListeProduits(id: string, updates: Partial<CreateListeProduitsData>) {
    const supabase = await createClientServer()

    const { data, error } = await (supabase as any)
        .from('liste_produits_semaine')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating liste:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/liste-semaine')

    return { data }
}

/**
 * Delete a weekly products list (admin only)
 */
export async function deleteListeProduits(id: string) {
    const supabase = await createClientServer()

    const { error } = await (supabase as any)
        .from('liste_produits_semaine')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting liste:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/liste-semaine')

    return { success: true }
}

/**
 * Activate a specific weekly products list (deactivates others)
 */
export async function activateListeProduits(id: string) {
    const supabase = await createClientServer()

    const { data, error } = await (supabase as any)
        .from('liste_produits_semaine')
        .update({ actif: true } as any)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error activating liste:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/liste-semaine')

    return { data }
}
