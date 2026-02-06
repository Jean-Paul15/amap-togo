'use server'

import { createClientServer } from '@amap-togo/database/server'
import { revalidatePath } from 'next/cache'

export interface Actualite {
    id: string
    titre: string
    slug: string
    contenu: string
    extrait: string | null
    image_url: string | null
    categorie: string
    auteur_id: string | null
    publie: boolean
    date_publication: string
    created_at: string
    updated_at: string
}

export interface CreateActualiteData {
    titre: string
    slug: string
    contenu: string
    extrait?: string
    image_url?: string
    categorie?: string
    publie?: boolean
}

/**
 * Get all published articles for public display
 */
export async function getPublishedActualites(): Promise<Actualite[]> {
    const supabase = await createClientServer()

    const { data, error } = await supabase
        .from('actualites')
        .select('*')
        .eq('publie', true)
        .order('date_publication', { ascending: false })

    if (error) {
        console.error('Error fetching published articles:', error)
        return []
    }

    return data || []
}

/**
 * Get a single article by slug
 */
export async function getActualiteBySlug(slug: string): Promise<Actualite | null> {
    const supabase = await createClientServer()

    const { data, error } = await (supabase as any)
        .from('actualites')
        .select('*')
        .eq('slug', slug)
        .eq('publie', true)
        .single()

    if (error) {
        console.error('Error fetching article:', error)
        return null
    }

    return data
}

/**
 * Get all articles (admin only)
 */
export async function getAllActualites(): Promise<Actualite[]> {
    const supabase = await createClientServer()

    const { data, error } = await (supabase as any)
        .from('actualites')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching all articles:', error)
        return []
    }

    return data || []
}

/**
 * Create a new article (admin only)
 */
export async function createActualite(articleData: CreateActualiteData) {
    const supabase = await createClientServer()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Non authentifié' }
    }

    const { data, error } = await (supabase as any)
        .from('actualites')
        .insert({
            ...articleData,
            auteur_id: user.id,
            publie: articleData.publie ?? false,
            categorie: articleData.categorie || 'général',
        } as any)
        .select()
        .single()

    if (error) {
        console.error('Error creating article:', error)
        return { error: error.message }
    }

    revalidatePath('/actualites')
    revalidatePath('/actualites-admin')

    return { data }
}

/**
 * Update an article (admin only)
 */
export async function updateActualite(id: string, updates: Partial<CreateActualiteData>) {
    const supabase = await createClientServer()

    const { data, error } = await (supabase as any)
        .from('actualites')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating article:', error)
        return { error: error.message }
    }

    revalidatePath('/actualites')
    revalidatePath(`/actualites/${data.slug}`)
    revalidatePath('/actualites-admin')

    return { data }
}

/**
 * Delete an article (admin only)
 */
export async function deleteActualite(id: string) {
    const supabase = await createClientServer()

    const { error } = await (supabase as any)
        .from('actualites')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting article:', error)
        return { error: error.message }
    }

    revalidatePath('/actualites')
    revalidatePath('/actualites-admin')

    return { success: true }
}

/**
 * Toggle publish status (admin only)
 */
export async function togglePublishStatus(id: string, currentStatus: boolean) {
    const supabase = await createClientServer()

    const { data, error } = await (supabase as any)
        .from('actualites')
        .update({
            publie: !currentStatus,
            date_publication: !currentStatus ? new Date().toISOString() : undefined
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error toggling publish status:', error)
        return { error: error.message }
    }

    revalidatePath('/actualites')
    revalidatePath('/actualites-admin')

    return { data }
}
