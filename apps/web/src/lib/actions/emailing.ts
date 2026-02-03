'use server'

import nodemailer from 'nodemailer'
import { createClientServer } from '@amap-togo/database/server'
import { revalidatePath } from 'next/cache'

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_APP_PASSWORD
const SMTP_FROM = process.env.SMTP_FROM || `AMAP Togo <${SMTP_USER}>`

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true, // true pour 465, false pour les autres ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
})

export interface SendEmailParams {
    to: string | string[]
    subject: string
    html: string
    from?: string
    replyTo?: string
}

/**
 * Envoie un email via SMTP (Gmail)
 */
export async function sendEmail({
    to,
    subject,
    html,
    from,
    replyTo
}: SendEmailParams) {
    try {
        if (!SMTP_USER || !SMTP_PASS) {
            console.warn('⚠️ SMTP non configuré : email non envoyé')
            return { success: false, error: 'Configuration SMTP manquante' }
        }

        console.log(`📧 Envoi email à : ${Array.isArray(to) ? to.join(', ') : to}`)

        const info = await transporter.sendMail({
            from: from || SMTP_FROM,
            to: typeof to === 'string' ? to : to.join(','),
            replyTo: replyTo,
            subject: subject,
            html: html,
        })

        console.log('✅ Email envoyé:', info.messageId)
        return { success: true, id: info.messageId }
    } catch (error) {
        console.error('❌ Erreur envoi email:', error)
        return { success: false, error: 'Erreur lors de l\'envoi' }
    }
}

// ============================================================================
// HELPER FUNCTIONS (Restaurées)
// ============================================================================

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

// Fonction de compatibilité pour l'ancien code (si utilisé ailleurs)
export async function sendEmailAction(encodedParams: any) {
    // Si l'appel vient du frontend avec un objet simple
    // Adapter selon le format attendu par sendEmail
    const { to, subject, html } = encodedParams
    return sendEmail({
        to,
        subject,
        html
    })
}
