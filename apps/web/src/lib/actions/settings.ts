'use server'

import { createClientServer } from '@amap-togo/database/server'
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
