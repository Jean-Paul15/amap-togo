// Hook pour les statistiques du dashboard
// Recupere toutes les metriques en parallele

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase'
import type {
  VenteJour,
  CommandeStatut,
  DashboardData,
} from '@/types'

const STATUT_COLORS: Record<string, string> = {
  en_attente: '#F59E0B',
  confirmee: '#3B82F6',
  en_preparation: '#8B5CF6',
  prete: '#10B981',
  livree: '#2D5A27',
  annulee: '#EF4444',
}

const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

/**
 * Hook pour charger les donnees du dashboard
 */
export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalProduits: 0,
      produitsStockFaible: 0,
      commandesEnAttente: 0,
      totalClients: 0,
      chiffreAffaires: 0,
    },
    ventesSemaine: [],
    commandesParStatut: [],
    topProduits: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      // Requetes en parallele pour les stats de base
      const [produitsRes, stockFaibleRes, commandesAttenteRes, clientsRes] =
        await Promise.all([
          supabaseClient
            .from('produits')
            .select('*', { count: 'exact', head: true })
            .eq('actif', true),
          supabaseClient
            .from('produits')
            .select('id')
            .eq('actif', true)
            .lte('stock', 5),
          supabaseClient
            .from('commandes')
            .select('*', { count: 'exact', head: true })
            .eq('statut', 'en_attente'),
          supabaseClient
            .from('profils')
            .select('*', { count: 'exact', head: true }),
        ])

      // Commandes de la semaine pour le graphique
      const dateDebut = new Date()
      dateDebut.setDate(dateDebut.getDate() - 6)
      const { data: commandesSemaine } = await supabaseClient
        .from('commandes')
        .select('created_at, montant_total')
        .gte('created_at', dateDebut.toISOString())

      // Calculer ventes par jour
      const ventesParJour = calculerVentesParJour(commandesSemaine || [])

      // Commandes par statut
      const { data: statutsData } = await supabaseClient
        .from('commandes')
        .select('statut')

      const commandesParStatut = calculerParStatut(statutsData || [])

      // Calculer chiffre d'affaires total (commandes payees ou livrees)
      const { data: totalVentes } = await supabaseClient
        .from('commandes')
        .select('montant_total, statut_paiement')
        .in('statut_paiement', ['paye', 'partiel'])

      const chiffreAffaires = (totalVentes || []).reduce(
        (acc, c) => acc + (c.montant_total || 0),
        0
      )

      setData({
        stats: {
          totalProduits: produitsRes.count || 0,
          produitsStockFaible: stockFaibleRes.data?.length || 0,
          commandesEnAttente: commandesAttenteRes.count || 0,
          totalClients: clientsRes.count || 0,
          chiffreAffaires,
        },
        ventesSemaine: ventesParJour,
        commandesParStatut,
        topProduits: [], // A implementer avec les lignes de commande
        loading: false,
        error: null,
      })
    } catch (error) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: 'Erreur lors du chargement des donnees',
      }))
    }
  }

  return data
}

function calculerVentesParJour(
  commandes: { created_at: string; montant_total: number }[]
): VenteJour[] {
  const aujourdhui = new Date()
  const resultat: VenteJour[] = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(aujourdhui)
    date.setDate(date.getDate() - i)
    const jourSemaine = JOURS[date.getDay()]
    const dateStr = date.toISOString().split('T')[0]

    const ventesJour = commandes.filter((c) =>
      c.created_at.startsWith(dateStr)
    )

    resultat.push({
      jour: jourSemaine,
      total: ventesJour.reduce((acc, c) => acc + (c.montant_total || 0), 0),
      commandes: ventesJour.length,
    })
  }

  return resultat
}

function calculerParStatut(
  commandes: { statut: string }[]
): CommandeStatut[] {
  const compteur: Record<string, number> = {}

  commandes.forEach((c) => {
    compteur[c.statut] = (compteur[c.statut] || 0) + 1
  })

  return Object.entries(compteur).map(([statut, count]) => ({
    statut,
    count,
    color: STATUT_COLORS[statut] || '#6B7280',
  }))
}
