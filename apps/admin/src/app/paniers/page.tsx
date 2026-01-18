// Page liste des paniers hebdomadaires
// Gestion des paniers AMAP par semaine

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/layout'
import { supabaseClient } from '@/lib/supabase'
import { Plus, ShoppingBag, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PanierSemaine {
  id: string
  semaine_debut: string
  semaine_fin: string
  actif: boolean
  created_at: string
  panier_type: { nom: string; prix: number } | null
  contenu: Array<{ id: string }>
}

export default function PaniersListPage() {
  const [paniers, setPaniers] = useState<PanierSemaine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPaniers() {
      try {
        const { data, error } = await supabaseClient
          .from('paniers_semaine')
          .select(`
            *,
            panier_type:paniers_types(nom, prix),
            contenu:paniers_contenu(id)
          `)
          .order('semaine_debut', { ascending: false })

        if (error) throw error
        setPaniers((data || []) as PanierSemaine[])
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaniers()
  }, [])

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  // Formater la date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Verifier si le panier est en cours
  const isCurrentWeek = (debut: string, fin: string) => {
    const now = new Date()
    return now >= new Date(debut) && now <= new Date(fin)
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Paniers</h1>
            <p className="text-sm text-gray-500">{paniers.length} paniers</p>
          </div>
          <Link
            href="/paniers/create"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau
          </Link>
        </div>

        {/* Liste */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="h-5 bg-gray-100 rounded mb-3 w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-50 rounded mb-2 w-1/2 animate-pulse" />
                <div className="h-4 bg-gray-50 rounded w-2/3 animate-pulse" />
              </div>
            ))
          ) : paniers.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-200">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Aucun panier</p>
            </div>
          ) : (
            paniers.map((panier) => {
              const isCurrent = isCurrentWeek(panier.semaine_debut, panier.semaine_fin)

              return (
                <div
                  key={panier.id}
                  className={cn(
                    'bg-white rounded-xl border p-5 relative',
                    isCurrent ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                  )}
                >
                  {isCurrent && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-green-500 text-white text-[10px] font-medium rounded-full">
                      En cours
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {panier.panier_type?.nom || 'Panier'}
                      </h3>
                      <p className="text-xs text-green-600 font-medium">
                        {panier.panier_type ? formatPrice(panier.panier_type.prix) : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(panier.semaine_debut)} - {formatDate(panier.semaine_fin)}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {panier.contenu?.length || 0} produits
                    </span>
                    <span className={cn(
                      'px-2 py-0.5 font-medium rounded-full',
                      panier.actif
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-100 text-gray-500'
                    )}>
                      {panier.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                    <Link
                      href={`/paniers/${panier.id}`}
                      className="flex-1 py-1.5 text-center text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Voir
                    </Link>
                    <Link
                      href={`/paniers/${panier.id}/edit`}
                      className="flex-1 py-1.5 text-center text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      Modifier
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
