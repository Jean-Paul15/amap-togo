// Page creation de role
// Formulaire avec matrice permissions

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RoleForm } from '@/components/admin/rbac'
import { supabaseClient } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'
import type { Ressource, PermissionInsert } from '@amap-togo/database'

export default function CreateRolePage() {
  const router = useRouter()
  const toast = useToast()
  const [ressources, setRessources] = useState<Ressource[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    async function fetchRessources() {
      const { data } = await supabaseClient
        .from('ressources')
        .select('*')
        .order('ordre')
      setRessources(data || [])
      setLoadingData(false)
    }
    fetchRessources()
  }, [])

  const handleSubmit = async (data: {
    nom: string
    description: string
    permissions: PermissionInsert[]
  }) => {
    setLoading(true)
    try {
      // Creer le role
      const { data: role, error: roleError } = await supabaseClient
        .from('roles')
        .insert({
          nom: data.nom,
          description: data.description || null,
        })
        .select()
        .single()

      if (roleError) throw roleError

      // Creer les permissions
      if (data.permissions.length > 0) {
        const permsToInsert = data.permissions.map((p) => ({
          ...p,
          role_id: role.id,
        }))

        const { error: permsError } = await supabaseClient
          .from('permissions')
          .insert(permsToInsert)

        if (permsError) throw permsError
      }

      router.push('/roles')
      router.refresh()
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la création du rôle')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
    )
  }

  return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/roles"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Nouveau role</h1>
            <p className="text-sm text-gray-500">
              Creez un role et definissez ses permissions
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <RoleForm
          ressources={ressources}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/roles')}
          loading={loading}
        />
      </div>
  )
}
