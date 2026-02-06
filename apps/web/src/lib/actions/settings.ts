'use server'

import { createClientServer } from '@amap-togo/database/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function getSystemSettings() {
    const supabase = await createClientServer()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
        .from('system_settings')
        .select('*')

    const settings: Record<string, string> = {}

    if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.forEach((row: any) => {
            settings[row.key] = row.value
        })
    }

    return settings
}

export async function updateSystemSettings(settings: Record<string, string>) {
    const supabase = await createClientServer()

    try {
        const updates = Object.entries(settings).map(([key, value]) => ({
            key,
            value,
            updated_at: new Date().toISOString()
        }))

        // Upsert chaque setting
        for (const update of updates) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from('system_settings')
                .upsert(update)

            if (error) throw error
        }

        revalidatePath('/(admin)/settings')
        return { success: true }
    } catch (error) {
        console.error('Erreur save settings:', error)
        return { success: false, error: 'Erreur sauvegarde' }
    }
}

/**
 * Upload générique pour les assets du site (Logo, Hero, etc.)
 * Sauvegarde l'URL dans system_settings
 */
export async function updateSiteAsset(
    formData: FormData,
    key: 'site_logo_url' | 'site_hero_url' | 'site_bg_image_url' | 'site_bg_video_url'
) {
    const supabase = await createClientServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non connecté' }

    const file = formData.get('file') as File
    if (!file) return { success: false, error: 'Aucun fichier' }

    // Validation
    if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Le fichier doit être une image' }
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
        return { success: false, error: 'Image trop volumineuse (Max 5MB)' }
    }

    const ext = file.name.split('.').pop()
    const fileName = `settings/${key}-${Date.now()}.${ext}`

    // 1. Upload via Admin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: uploadError } = await (supabaseAdmin as any).storage
        .from('images')
        .upload(fileName, file, {
            contentType: file.type,
            upsert: true
        })

    if (uploadError) {
        console.error('Erreur upload:', uploadError)
        return { success: false, error: 'Erreur lors de l\'upload' }
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
        .from('images')
        .getPublicUrl(fileName)

    // 3. Update system_settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase as any)
        .from('system_settings')
        .upsert({
            key: key,
            value: publicUrl,
            description: key === 'site_logo_url' ? 'Logo du site' : 'Image Hero Accueil',
            updated_at: new Date().toISOString()
        })

    if (dbError) {
        console.error('Erreur DB settings:', dbError)
        return { success: false, error: 'Erreur sauvegarde DB' }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/(admin)/settings')
    return { success: true, url: publicUrl }
}
