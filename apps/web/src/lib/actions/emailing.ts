'use server'

import nodemailer from 'nodemailer'
import { createClientServer } from '@amap-togo/database/server'
import { revalidatePath } from 'next/cache'
import { getSystemSettings } from '@/lib/actions/settings'

// Valeurs par défaut (fallback env)
const DEFAULT_SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const DEFAULT_SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const DEFAULT_SMTP_USER = process.env.SMTP_USER
const DEFAULT_SMTP_PASS = process.env.SMTP_APP_PASSWORD
const DEFAULT_SMTP_FROM = process.env.SMTP_FROM

export interface SendEmailParams {
    to: string | string[]
    subject: string
    html: string
    from?: string
    replyTo?: string
}

/**
 * Envoie un email via SMTP (Gmail)
 * Utilise les paramètres DB si disponibles, sinon ENV
 */
export async function sendEmail({
    to,
    subject,
    html,
    from,
    replyTo
}: SendEmailParams) {
    try {
        // 1. Récupérer conf dynamique
        const settings = await getSystemSettings()

        const smtpUser = settings['smtp_user'] || DEFAULT_SMTP_USER
        const smtpPass = settings['smtp_password'] || DEFAULT_SMTP_PASS

        // Host/Port pourraient aussi être dynamiques si besoin, pour l'instant on garde env ou default
        const smtpHost = DEFAULT_SMTP_HOST
        const smtpPort = DEFAULT_SMTP_PORT

        if (!smtpUser || !smtpPass) {
            console.warn('⚠️ SMTP non configuré : email non envoyé')
            return { success: false, error: 'Configuration SMTP manquante' }
        }

        // 2. Créer transporteur à la volée
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: true,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        })

        console.log(`📧 Envoi email à : ${Array.isArray(to) ? to.join(', ') : to}`)

        // 3. Envoyer
        const smtpFrom = from || DEFAULT_SMTP_FROM || `AMAP Togo <${smtpUser}>`

        const info = await transporter.sendMail({
            from: smtpFrom,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
        .from('mailing_contacts')
        .select('*')
        .order('created_at', { ascending: false })
    return data || []
}

export async function addMailingContact(email: string, nom?: string) {
    const supabase = await createClientServer()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
        .from('mailing_contacts')
        .insert({ email, nom })

    if (error) return { success: false, error: error.message }
    revalidatePath('/(admin)/emails')
    return { success: true }
}

export async function deleteMailingContact(id: string) {
    const supabase = await createClientServer()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: contacts } = await (supabase as any)
        .from('mailing_contacts')
        .select('id, email, nom')

    const all = [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(profiles || []).map((p: any) => ({
            email: p.email,
            name: `${p.prenom || ''} ${p.nom || ''}`.trim(),
            type: p.role_id || 'user',
            id: p.id
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

