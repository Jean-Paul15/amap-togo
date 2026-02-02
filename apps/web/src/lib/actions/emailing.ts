'use server'

import { Resend } from 'resend'
import { createClientServer } from '@amap-togo/database/server'
import { revalidatePath } from 'next/cache'

const resend = new Resend(process.env.RESEND_API_KEY)

// Config de l'expéditeur (à vérifier avec le domaine du client)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AMAP Togo <onboarding@resend.dev>'

export async function sendEmailAction({ to, subject, html }: { to: string[], subject: string, html: string }) {
    try {
        if (!process.env.RESEND_API_KEY) {
            return { success: false, error: 'Clé API Resend manquante' }
        }

        const isOnboarding = FROM_EMAIL.includes('onboarding@resend.dev')
        const adminEmail = process.env.ADMIN_EMAIL || 'amap.togo@gmail.com'

        if (isOnboarding) {
            // Mode TEST : On envoie tout à l'admin pour éviter les erreurs Resend
            // et on liste les vrais destinataires dans le corps du mail

            // On fait un seul envoi global au lieu de loops pour éviter le spam de l'admin
            const allRecipients = to.join(', ')

            const testHtml = `
                <div style="background: #f3f4f6; padding: 10px; border: 1px dashed #666; margin-bottom: 20px;">
                    <strong>MODE TEST - AMAP TOGO</strong><br/>
                    <em>Ceci est une simulation car le domaine n'est pas encore vérifié.</em><br/><br/>
                    <strong>Destinataires prévus (${to.length}) :</strong><br/>
                    <small>${allRecipients}</small>
                </div>
                <hr/>
                ${html}
            `

            const { error } = await resend.emails.send({
                from: FROM_EMAIL,
                to: [adminEmail],
                subject: `[TEST] ${subject}`,
                html: testHtml,
            })

            if (error) {
                console.error('Erreur Resend Test:', error)
                return { success: false, error: error.message }
            }

            return { success: true }
        }

        // Mode PROD (Domaine vérifié)
        const chunks = []
        for (let i = 0; i < to.length; i += 50) {
            chunks.push(to.slice(i, i + 50))
        }

        for (const chunk of chunks) {
            const { error } = await resend.emails.send({
                from: FROM_EMAIL,
                to: [adminEmail], // L'admin reçoit toujours une copie
                bcc: chunk, // Les clients en copie cachée
                subject: subject,
                html: html,
            })

            if (error) {
                console.error('Erreur Resend chunk:', error)
            }
        }

        return { success: true }
    } catch (error: any) {
        console.error('Erreur sendEmailAction:', error)
        return { success: false, error: error.message }
    }
}

export async function getMailingContacts() {
    const supabase = await createClientServer()
    const { data } = await (supabase as any)
        .from('mailing_contacts')
        .select('*')
        .order('created_at', { ascending: false })
    return data || []
}

export async function addMailingContact(email: string, nom?: string) {
    const supabase = await createClientServer()
    const { error } = await (supabase as any)
        .from('mailing_contacts')
        .insert({ email, nom })

    if (error) return { success: false, error: error.message }
    revalidatePath('/(admin)/emails')
    return { success: true }
}

export async function deleteMailingContact(id: string) {
    const supabase = await createClientServer()
    const { error } = await (supabase as any)
        .from('mailing_contacts')
        .delete()
        .eq('id', id)

    if (error) return { success: false, error: error.message }
    revalidatePath('/(admin)/emails')
    return { success: true }
}

export async function getAllRecipients() {
    const supabase = await createClientServer()

    // 1. Clients
    const { data: profiles } = await supabase
        .from('profils')
        .select('id, email, nom, prenom, role_id')

    // 2. Contacts manuels
    const { data: contacts } = await (supabase as any)
        .from('mailing_contacts')
        .select('id, email, nom')

    const all = [
        ...(profiles || []).map((p: any) => ({
            email: p.email,
            name: `${p.prenom || ''} ${p.nom || ''}`.trim(),
            type: p.role_id || 'user',
            id: p.id
        })),
        ...(contacts || []).map((c: any) => ({
            email: c.email,
            name: c.nom || 'Contact externe',
            type: 'manuel',
            id: c.id
        }))
    ]

    // Dedup
    const unique = new Map()
    all.forEach(item => {
        if (!unique.has(item.email)) unique.set(item.email, item)
    })

    return Array.from(unique.values())
}
