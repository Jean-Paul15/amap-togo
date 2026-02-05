'use server'

import { z } from 'zod'
import { createClientServer } from '@amap-togo/database/server'
import { revalidatePath } from 'next/cache'

const recordSchema = z.object({
    date: z.string(),
    type: z.enum(['recette', 'depense']),
    montant: z.number().int().positive(),
    description: z.string().min(2),
    categorie: z.string().optional(),
    product_id: z.string().optional().nullable(),
})

export type FinancialRecordInput = z.infer<typeof recordSchema>

export interface FinancialRecord {
    id: string
    date: string
    type: 'recette' | 'depense'
    montant: number
    description: string
    categorie: string | null
    product_id: string | null
    produits?: { nom: string } | null
    created_at: string
}

export async function getFinancialRecords(start: string, end: string) {
    try {
        const supabase = await createClientServer()

        // On utilise any car la table n'est peut-être pas encore générée dans les types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('financial_records')
            .select('*, produits(nom)')
            .gte('date', start)
            .lte('date', end)
            .order('date', { ascending: false })

        if (error) {
            // Si la table n'existe pas, on retourne vide sans crasher (pour le moment)
            if (error.code === '42P01') return [] // undefined_table
            throw error
        }

        return (data || []) as FinancialRecord[]
    } catch (error) {
        console.error('Erreur getFinancialRecords:', error)
        return []
    }
}

export async function addFinancialRecord(input: FinancialRecordInput) {
    try {
        const data = recordSchema.parse(input)
        const supabase = await createClientServer()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('financial_records')
            .insert(data)

        if (error) throw error

        revalidatePath('/(admin)/gestion')
        return { success: true }
    } catch (error) {
        console.error('Erreur addFinancialRecord:', error)
        return { success: false, error: 'Erreur lors de l\'ajout' }
    }
}

export async function deleteFinancialRecord(id: string) {
    try {
        const supabase = await createClientServer()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('financial_records')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/(admin)/gestion')
        return { success: true }
    } catch (error) {
        console.error('Erreur deleteFinancialRecord:', error)
        return { success: false, error: 'Erreur lors de la suppression' }
    }
}
