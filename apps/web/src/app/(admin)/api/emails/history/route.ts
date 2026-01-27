// API Route : Liste des emails envoyés via Resend
// Récupération de l'historique avec pagination

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { ResendEmailListResponse } from '@/types/resend.types'

// Initialisation Resend
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * GET /api/emails/history
 * Récupère la liste des emails envoyés
 * Query params: limit (default 50), after (pagination)
 */
export async function GET(request: NextRequest) {
  try {
    // Vérification de la clé API
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Clé API Resend non configurée' },
        { status: 500 }
      )
    }

    // Lecture des paramètres de pagination
    const { searchParams } = new URL(request.url)
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '50', 10),
      100
    )
    const after = searchParams.get('after') || undefined

    // Appel API Resend
    const { data, error } = await resend.emails.list({
      limit,
      after
    })

    if (error) {
      console.error('Erreur Resend list:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Typage de la réponse
    const response: ResendEmailListResponse = {
      object: 'list',
      has_more: data?.has_more || false,
      data: data?.data || []
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erreur historique emails:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'historique' },
      { status: 500 }
    )
  }
}
