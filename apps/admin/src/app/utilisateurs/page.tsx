// Page liste des utilisateurs admin
// Gestion des comptes avec roles

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/layout'
import { supabaseClient } from '@/lib/supabase'
import { Search, Plus, Edit, User, Users, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Utilisateur {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string | null
  created_at: string
  role_id: string | null
  roles: { nom: string } | null
}

export default function UtilisateursListPage() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [roles, setRoles] = useState<{ id: string; nom: string }[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          supabaseClient
            .from('profils')
            .select(`
              id, nom, prenom, email, telephone, created_at, role_id,
              roles:role_id (nom)
            `)
            .order('created_at', { ascending: false }),
          supabaseClient.from('roles').select('id, nom').order('nom'),
        ])

        if (usersRes.error) throw usersRes.error
        setUtilisateurs(usersRes.data as unknown as Utilisateur[])
        setRoles(rolesRes.data || [])
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredUtilisateurs = utilisateurs.filter((u) => {
    const matchSearch =
      u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.prenom.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())

    const matchRole = !roleFilter || u.role_id === roleFilter

    return matchSearch && matchRole
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getRoleColor = (roleName: string | undefined) => {
    switch (roleName) {
      case 'admin':
        return { bg: 'bg-red-50', text: 'text-red-600' }
      case 'vendeur':
        return { bg: 'bg-violet-50', text: 'text-violet-600' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' }
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Utilisateurs</h1>
            <p className="text-sm text-gray-500">
              {utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/utilisateurs/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvel utilisateur
          </Link>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setRoleFilter(null)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                !roleFilter
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
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize',
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

        {/* Liste */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Utilisateur
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Role
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
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-10 bg-gray-50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredUtilisateurs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucun utilisateur</p>
                  </td>
                </tr>
              ) : (
                filteredUtilisateurs.map((user) => {
                  const roleName = user.roles?.nom
                  const colors = getRoleColor(roleName)
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {user.prenom} {user.nom}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          {user.telephone || '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {roleName ? (
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize',
                            colors.bg, colors.text
                          )}>
                            <Shield className="w-3 h-3" />
                            {roleName}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Non assigne</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/clients/${user.id}/edit`}
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
        </div>
      </div>
    </AdminLayout>
  )
}
