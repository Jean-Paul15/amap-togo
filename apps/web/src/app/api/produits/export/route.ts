/* Route API pour exporter les produits en Excel avec stats de commandes */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Produit } from '@amap-togo/database'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

interface ProduitStats extends Produit {
  commandes_count: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { days } = body

    if (!days || days < 1) {
      return NextResponse.json(
        { error: 'Durée invalide (minimum 1 jour)' },
        { status: 400 }
      )
    }

    /* Récupérer tous les produits */
    const { data: produits, error: produitsError } = await supabase
      .from('produits')
      .select('*')
      .order('nom')

    if (produitsError) throw produitsError
    if (!produits) return NextResponse.json({ data: [] })

    /* Calculer la date de début */
    const dateDebut = new Date()
    dateDebut.setDate(dateDebut.getDate() - days)

    /* Récupérer les commandes et compter par produit */
    const { data: commandes, error: commandesError } = await supabase
      .from('commandes')
      .select('id, created_at')
      .gte('created_at', dateDebut.toISOString())

    if (commandesError) throw commandesError

    const commandeIds = commandes?.map((c) => c.id) || []

    let commandesStats: Record<string, number> = {}

    if (commandeIds.length > 0) {
      const { data: lignes, error: lignesError } = await supabase
        .from('commandes_lignes')
        .select('produit_id')
        .in('commande_id', commandeIds)

      if (lignesError) throw lignesError

      /* Compter par produit */
      lignes?.forEach((ligne) => {
        commandesStats[ligne.produit_id] =
          (commandesStats[ligne.produit_id] || 0) + 1
      })
    }

    /* Enrichir les produits avec stats */
    const produitsAvecStats: ProduitStats[] = produits.map((p) => ({
      ...p,
      commandes_count: commandesStats[p.id] || 0,
    }))

    return NextResponse.json({
      data: produitsAvecStats,
      period: {
        days,
        dateDebut: dateDebut.toISOString().split('T')[0],
        dateFin: new Date().toISOString().split('T')[0],
      },
    })
  } catch (error) {
    console.error('Erreur export:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    )
  }
}
