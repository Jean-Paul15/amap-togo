// Page liste des commandes
// Style Apple epure

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'
import { Eye, Clock, CheckCircle, Package, Truck, ShoppingCart, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Commande {
  id: string
  numero: string
  statut: string
  statut_paiement: string
  montant_total: number
  created_at: string
  client_id: string | null
  client_anonyme: { nom?: string; prenom?: string; telephone?: string } | null
  client: { nom: string; prenom: string; telephone: string } | null
}

const statuts = [
  { value: null, label: 'Toutes' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmees' },
  { value: 'preparee', label: 'Preparees' },
  { value: 'livree', label: 'Livrees' },
  { value: 'annulee', label: 'Annulees' },
]

const statutConfig: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  en_attente: { bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock },
  confirmee: { bg: 'bg-blue-50', text: 'text-blue-600', icon: CheckCircle },
  preparee: { bg: 'bg-violet-50', text: 'text-violet-600', icon: Package },
  livree: { bg: 'bg-green-50', text: 'text-green-600', icon: Truck },
  annulee: { bg: 'bg-gray-100', text: 'text-gray-500', icon: XCircle },
}

export default function CommandesListPage() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)
  const [statutFilter, setStatutFilter] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCommandes() {
      try {
        let query = supabaseClient
          .from('commandes')
          .select('id, numero, statut, statut_paiement, montant_total, created_at, client_id, client_anonyme, client:client_id(nom, prenom, telephone)')
          .order('created_at', { ascending: false })

        if (statutFilter) {
          query = query.eq('statut', statutFilter)
        }

        const { data, error } = await query
        if (error) throw error
        
        // Transformer les donnees pour gerer le format Supabase
        const formattedData = (data || []).map((cmd) => ({
          ...cmd,
          // Supabase retourne un objet pour les relations single
          client: Array.isArray(cmd.client) ? cmd.client[0] || null : cmd.client,
        })) as Commande[]
        
        setCommandes(formattedData)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommandes()
  }, [statutFilter])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
      <div className="space-y-6">
        {/* Header moderne */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Commandes
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {commandes.length} commandes au total
            </p>
          </div>
        </div>

        {/* Filtres modernes */}
        <div className="flex gap-2 flex-wrap">
          {statuts.map((s) => (
            <button
              key={s.value || 'all'}
              onClick={() => setStatutFilter(s.value)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                statutFilter === s.value
                  ? 'bg-green-600 text-white shadow-md shadow-green-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Table moderne */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Numero
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-5 py-4">
                      <div className="h-14 bg-gray-50 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : commandes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                        <ShoppingCart className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        Aucune commande
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Les commandes apparaitront ici
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                commandes.map((cmd) => {
                  const config = statutConfig[cmd.statut] || statutConfig.en_attente
                  const StatusIcon = config.icon

                  return (
                    <tr
                      key={cmd.id}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-gray-900 font-mono">
                          {cmd.numero}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {cmd.client?.prenom || cmd.client_anonyme?.prenom || ''} {cmd.client?.nom || cmd.client_anonyme?.nom || 'Client anonyme'}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {cmd.client?.telephone || cmd.client_anonyme?.telephone || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-gray-900 tabular-nums">
                          {formatPrice(cmd.montant_total)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full',
                            config.bg,
                            config.text
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {cmd.statut.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full',
                            cmd.statut_paiement === 'paye'
                              ? 'bg-green-50 text-green-600 ring-1 ring-green-100'
                              : cmd.statut_paiement === 'partiel'
                              ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'
                              : 'bg-gray-100 text-gray-500'
                          )}
                        >
                          {cmd.statut_paiement.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-gray-500">
                          {formatDate(cmd.created_at)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/commandes/${cmd.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 hover:text-white bg-green-50 hover:bg-green-600 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Voir
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
  )
}
