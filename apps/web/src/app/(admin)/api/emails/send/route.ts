// API Route : Envoi d'emails via Resend
// Envoi individuel pour gérer les erreurs par destinataire

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import type {
  SendEmailsPayload,
  CampaignSendResult,
  EmailSendResult
} from '@/types/resend.types'

// Initialisation Resend avec clé API (ou fallback pour le build)
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789')

// Email expéditeur configuré en env
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AMAP Togo <contact@amaptogo.org>'

/**
 * Envoie un email à un destinataire unique
 * Retourne le résultat avec l'ID ou l'erreur
 */
async function sendSingleEmail(
  to: string,
  subject: string,
  html: string
): Promise<EmailSendResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      tags: [
        { name: 'type', value: 'diffusion' },
        { name: 'source', value: 'backoffice' }
      ]
    })

    if (error) {
      return { email: to, success: false, error: error.message }
    }

    return { email: to, success: true, id: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return { email: to, success: false, error: message }
  }
}

/**
 * POST /api/emails/send
 * Envoie des emails à une liste de destinataires
 */
export async function POST(request: NextRequest) {
  try {
    // Vérification de la clé API
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Clé API Resend non configurée' },
        { status: 500 }
      )
    }

    // Lecture et validation du payload
    const body = await request.json() as SendEmailsPayload
    const { recipients, subject, htmlContent } = body

    if (!recipients?.length) {
      return NextResponse.json(
        { error: 'Aucun destinataire spécifié' },
        { status: 400 }
      )
    }

    if (!subject?.trim()) {
      return NextResponse.json(
        { error: 'Sujet requis' },
        { status: 400 }
      )
    }

    if (!htmlContent?.trim()) {
      return NextResponse.json(
        { error: 'Contenu requis' },
        { status: 400 }
      )
    }

    // Envoi séquentiel pour respecter les rate limits
    const details: EmailSendResult[] = []

    for (const email of recipients) {
      const result = await sendSingleEmail(email, subject, htmlContent)
      details.push(result)
    }

    // Calcul des statistiques
    const sent = details.filter(d => d.success).length
    const failed = details.filter(d => !d.success).length
    const total = recipients.length

    // Construction du message de résultat
    const message = failed === 0
      ? `Email envoyé avec succès à ${sent}/${total} destinataire(s)`
      : `Email envoyé à ${sent}/${total} destinataire(s), ${failed} échec(s)`

    const result: CampaignSendResult = {
      success: sent > 0,
      total,
      sent,
      failed,
      message,
      details
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur envoi emails:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi des emails' },
      { status: 500 }
    )
  }
}
