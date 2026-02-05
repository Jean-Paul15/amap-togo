'use server'

import { createClientServer } from '@amap-togo/database/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

/**
 * Mise à jour des informations du profil
 */
export async function updateProfile(data: {
    nom: string
    prenom: string
    telephone?: string | null
}) {
    const supabase = await createClientServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non connecté' }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
        .from('profils')
        .update({
            nom: data.nom,
            prenom: data.prenom,
            telephone: data.telephone,
        })
        .eq('id', user.id)

    if (error) {
        console.error('Erreur updateProfile:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/(admin)/settings')
    return { success: true }
}

/**
 * Mise à jour du mot de passe
 */
export async function updateUserPassword(password: string) {
    const supabase = await createClientServer()
    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        console.error('Erreur updatePassword:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

/**
 * Upload d'avatar vers bucket 'images' dans le dossier 'avatars/'
 */
export async function updateAvatar(formData: FormData) {
    const supabase = await createClientServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non connecté' }

    const file = formData.get('file') as File
    if (!file) return { success: false, error: 'Aucun fichier' }

    // Validation basique
    if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Le fichier doit être une image' }
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
        return { success: false, error: 'Image trop volumineuse (Max 2MB)' }
    }

    const ext = file.name.split('.').pop()
    const fileName = `avatars/${user.id}-${Date.now()}.${ext}`

    // 1. Upload du fichier via Admin pour bypass RLS sur le bucket si nécessaire
    // ou via user standard si policies OK. On utilise Admin pour être sûr.
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

    // 3. Update profil
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase as any)
        .from('profils')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

    if (dbError) {
        return { success: false, error: 'Erreur sauvegarde DB' }
    }

    revalidatePath('/(admin)/settings')
    return { success: true, url: publicUrl }
}
