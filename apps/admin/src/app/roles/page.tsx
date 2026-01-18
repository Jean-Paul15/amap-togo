// Page liste des roles
// Gestion RBAC

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/layout'
import { supabaseClient } from '@/lib/supabase'
import { Shield, Plus, Edit, Trash2, Users, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Role } from '@amap-togo/database'

export default function RolesListPage() {
  const [roles, setRoles] = useState<(Role & { users_count: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRoles() {
      try {
        const { data: rolesData, error } = await supabaseClient
          .from('roles')
          .select('*')
          .order('est_systeme', { ascending: false })
          .order('nom')

        if (error) throw error

        // Compter les utilisateurs par role
        const { data: counts } = await supabaseClient
          .from('profils')
          .select('role_id')

        const countMap = new Map<string, number>()
        counts?.forEach((p) => {
          if (p.role_id) {
            countMap.set(p.role_id, (countMap.get(p.role_id) || 0) + 1)
          }
        })

        const rolesWithCount = (rolesData || []).map((r) => ({
          ...r,
          users_count: countMap.get(r.id) || 0,
        }))

        setRoles(rolesWithCount)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce role ?')) return

    try {
      const { error } = await supabaseClient
        .from('roles')
        .delete()
        .eq('id', id)

      if (error) throw error
      setRoles((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header moderne */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Roles
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gerez les roles et leurs permissions
            </p>
          </div>
          <Link
            href="/roles/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Nouveau role
          </Link>
        </div>

        {/* Liste en grille */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="h-24 bg-gray-50 rounded-xl animate-pulse" />
              </div>
            ))
          ) : roles.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">Aucun role</p>
              <p className="text-xs text-gray-400 mt-1">Creez votre premier role</p>
            </div>
          ) : (
            roles.map((role) => (
              <div
                key={role.id}
                className={cn(
                  'group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
                  role.est_systeme && 'ring-2 ring-amber-200/50 border-amber-200'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl shadow-sm',
                      role.est_systeme
                        ? 'bg-gradient-to-br from-amber-100 to-amber-50'
                        : 'bg-gradient-to-br from-green-100 to-green-50'
                    )}>
                      {role.est_systeme ? (
                        <Lock className="w-5 h-5 text-amber-600" />
                      ) : (
                        <Shield className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 capitalize">
                        {role.nom}
                      </h3>
                      {role.est_systeme && (
                        <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">
                          Role systeme
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/roles/${role.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    {!role.est_systeme && (
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {role.description && (
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-medium">
                      {role.users_count} utilisateur{role.users_count > 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className="text-gray-400">{formatDate(role.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
