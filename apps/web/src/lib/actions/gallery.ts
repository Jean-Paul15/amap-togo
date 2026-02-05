'use server'

import { createClientServer } from '@amap-togo/database/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'

export interface GalleryMedia {
    id: string
    title: string | null
    url: string
    type: 'image' | 'video'
    created_at: string
}

export async function getGalleryMedia() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createClientServer() as any
    const { data, error } = await supabase
        .from('gallery_media')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching gallery:', error)
        return []
    }
    return data as GalleryMedia[]
}

/**
 * Upload d'un média vers Supabase Storage (Server Side)
 * Permet de contourner les politiques RLS via supabaseAdmin
 */
export async function uploadGalleryMediaAction(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) throw new Error('Aucun fichier fourni')

    const ext = file.name.split('.').pop()
    const fileName = `gallery-${Date.now()}.${ext}`
    const filePath = `gallery/${fileName}`

    // Upload via supabaseAdmin (bypass RLS)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).storage
        .from('images')
        .upload(filePath, file)

    if (error) throw error

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabaseAdmin.storage
        .from('images')
        .getPublicUrl(filePath)

    return publicUrl
}

export async function addGalleryMedia(url: string, title: string, type: 'image' | 'video' = 'image') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createClientServer() as any
    const { error } = await supabase
        .from('gallery_media')
        .insert([{ url, title, type }])

    if (error) throw error

    revalidatePath('/cultures')
    revalidatePath('/admin/gallery')
}

export async function deleteGalleryMedia(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createClientServer() as any

    // 1. Récupérer le média pour savoir s'il faut supprimer un fichier du storage
    const { data: media } = await supabase
        .from('gallery_media')
        .select('url')
        .eq('id', id)
        .single()

    if (media && media.url.includes('/gallery/')) {
        const filePath = media.url.split('/gallery/').pop()
        if (filePath) {
            // Suppression du fichier physique via supabaseAdmin
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabaseAdmin as any).storage
                .from('images')
                .remove([`gallery/${filePath}`])
        }
    }

    // 2. Supprimer de la base de données
    const { error } = await supabase
        .from('gallery_media')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/cultures')
    revalidatePath('/admin/gallery')
}
