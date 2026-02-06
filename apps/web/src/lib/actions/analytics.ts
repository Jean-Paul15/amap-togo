'use server'

import { createClientServer } from '@amap-togo/database/server'
import { revalidatePath } from 'next/cache'

/**
 * Incrémente le nombre de vues pour une page donnée
 */
export async function incrementPageView(path: string = '/') {
    try {
        const supabase = await createClientServer()

        // On utilise rpc pour être atomique si possible, ou une requête simple
        // Ici upsert simple avec increment

        // Note: Supabase n'a pas d'opérateur atomique "inc" simple en JS client sans RPC,
        // mais on peut le faire en SQL. 
        // Pour faire simple et robuste sans RPC custom :
        // On lit, on incrémente, on écrit. (Pas 100% atomique sous forte charge mais suffisant ici)

        // Mieux : créer une fonction RPC 'increment_page_view'
        // Mais pour rester dans le code app :

        const { data: current } = await (supabase as any)
            .from('analytics')
            .select('views')
            .eq('page_path', path)
            .single()

        const newCount = (current?.views || 0) + 1

        const { error } = await (supabase as any)
            .from('analytics')
            .upsert({
                page_path: path,
                views: newCount,
                updated_at: new Date().toISOString()
            } as any)

        if (error) throw error

        revalidatePath(path)
        return { success: true, views: newCount }
    } catch (error) {
        console.error('Erreur increment view:', error)
        return { success: false }
    }
}

/**
 * Récupère le nombre de vues pour une page
 */
export async function getPageViews(path: string = '/') {
    try {
        const supabase = await createClientServer()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
            .from('analytics')
            .select('views')
            .eq('page_path', path)
            .single()

        return data?.views || 0
    } catch {
        return 0
    }
}
