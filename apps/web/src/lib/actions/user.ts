'use server'

import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

const createUserSchema = z.object({
    nom: z.string().min(2),
    prenom: z.string().min(2),
    email: z.string().email(),
    telephone: z.string().optional(),
    adresse: z.string().optional(),
    quartier: z.string().optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export async function createUser(input: CreateUserInput) {
    try {
        const data = createUserSchema.parse(input)

        // 1. Créer l'utilisateur dans Auth (avec un mot de passe par défaut)
        // Mot de passe par défaut: amaptogo2025 (ou random)
        const password = 'amaptogo' + new Date().getFullYear()

        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: password,
            email_confirm: true,
            user_metadata: {
                nom: data.nom,
                prenom: data.prenom,
            }
        })

        if (authError) throw authError
        if (!authUser.user) throw new Error('Erreur création user')

        // 2. Créer le profil (si pas fait par trigger)
        // On vérifie si le trigger existe souvent, mais pour être sûr on peut update
        // ou insert dans 'profils'. Supabase a souvent un trigger on_auth_user_created.
        // On va assumer que le trigger le fait, et on update avec les infos supplémentaires.

        // Attendre un peu que le trigger se déclenche ou faire un upsert
        const { error: profileError } = await supabaseAdmin
            .from('profils')
            .update({
                nom: data.nom,
                prenom: data.prenom,
                telephone: data.telephone || null,
                adresse: data.adresse || null,
                quartier: data.quartier || null,
                // role_id peut être défini par défaut
            })
            .eq('id', authUser.user.id)

        if (profileError) {
            // En cas d'erreur (ex: trigger n'a pas encore créé la ligne), on tente un insert
            const { error: insertError } = await supabaseAdmin
                .from('profils')
                .insert({
                    id: authUser.user.id,
                    email: data.email,
                    nom: data.nom,
                    prenom: data.prenom,
                    telephone: data.telephone || null,
                    adresse: data.adresse || null,
                    quartier: data.quartier || null,
                })

            if (insertError) {
                console.error('Erreur profil:', insertError)
                // Ne pas bloquer si le user Auth est créé mais le profil a échoué (rare)
                // Mais c'est mieux de retourner l'erreur
            }
        }

        revalidatePath('/(admin)/clients')
        return { success: true, userId: authUser.user.id, password }
    } catch (error) {
        console.error('Erreur createUser:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }
    }
}
