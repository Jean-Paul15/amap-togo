// Page liste des clients
// Style Apple epure - Compatible RBAC

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'
import { Search, Edit, User, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Client {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string | null
  role_id: string | null
  role_nom: string | null
  solde_credit: number
  created_at: string
}

interface Role {
  id: string
  nom: string
}

export default function ClientsListPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Charger les roles
        const { data: rolesData } = await supabaseClient
          .from('roles')
          .select('id, nom')
          .eq('actif', true)
          .order('nom')
        
        setRoles(rolesData || [])

        // Charger les clients avec jointure sur roles
        let query = supabaseClient
          .from('profils')
          .select(`
            id, nom, prenom, email, telephone, role_id, solde_credit, created_at,
            roles:role_id (nom)
          `)
          .order('created_at', { ascending: false })

        if (roleFilter) {
          query = query.eq('role_id', roleFilter)
        }

        const { data, error } = await query
        if (error) throw error

        const clientsWithRole = (data || []).map((c) => {
          const rolesData = c.roles as { nom: string }[] | { nom: string } | null
          const roleName = Array.isArray(rolesData) 
            ? rolesData[0]?.nom 
            : rolesData?.nom
          return {
            ...c,
            role_nom: roleName || null,
          }
        }) as Client[]

        setClients(clientsWithRole)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [roleFilter])

  const filteredClients = clients.filter((c) =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.prenom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const roleColors: Record<string, { bg: string; text: string }> = {
    admin: { bg: 'bg-red-50', text: 'text-red-600' },
    vendeur: { bg: 'bg-violet-50', text: 'text-violet-600' },
    producteur: { bg: 'bg-amber-50', text: 'text-amber-600' },
    adherent: { bg: 'bg-green-50', text: 'text-green-600' },
    client: { bg: 'bg-gray-100', text: 'text-gray-500' },
  }

  return (
      <div className="space-y-4 sm:space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Clients</h1>
          <p className="text-xs sm:text-sm text-gray-500">{clients.length} utilisateurs</p>
        </div>

        {/* Filtres */}
        <div className="flex flex-col gap-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
            <button
              onClick={() => setRoleFilter(null)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize flex-shrink-0',
                roleFilter === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              )}
            >
              Tous
            </button>
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRoleFilter(r.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize flex-shrink-0',
                  roleFilter === r.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                )}
              >
                {r.nom}
              </button>
            ))}
          </div>
        </div>

        {/* Liste - Table desktop, Cards mobile */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table desktop */}
          <table className="w-full hidden sm:table">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Client
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Rôle
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Crédit
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Inscription
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-10 bg-gray-50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucun client</p>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const roleName = client.role_nom || 'client'
                  const colors = roleColors[roleName] || roleColors.client
                  return (
                    <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {client.prenom} {client.nom}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{client.email}</p>
                        <p className="text-xs text-gray-400">
                          {client.telephone || '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize',
                          colors.bg, colors.text
                        )}>
                          {roleName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {roleName === 'adherent' ? (
                          <span className="text-sm font-medium text-green-600">
                            {formatPrice(client.solde_credit)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(client.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/clients/${client.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors inline-flex"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>

          {/* Cards mobile */}
          <div className="sm:hidden divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4">
                  <div className="h-16 bg-gray-50 rounded-lg animate-pulse" />
                </div>
              ))
            ) : filteredClients.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucun client</p>
              </div>
            ) : (
              filteredClients.map((client) => {
                const roleName = client.role_nom || 'client'
                const colors = roleColors[roleName] || roleColors.client
                return (
                  <Link
                    key={client.id}
                    href={`/clients/${client.id}/edit`}
                    className="flex items-center justify-between gap-3 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {client.prenom} {client.nom}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{client.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            'inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full capitalize',
                            colors.bg, colors.text
                          )}>
                            {roleName}
                          </span>
                          {roleName === 'adherent' && (
                            <span className="text-[10px] font-medium text-green-600">
                              {formatPrice(client.solde_credit)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Edit className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>
  )
}
