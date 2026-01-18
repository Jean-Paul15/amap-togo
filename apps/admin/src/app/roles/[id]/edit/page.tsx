// Page edition de role
// Modification du role et ses permissions

'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/layout'
import { RoleForm } from '@/components/rbac'
import { supabaseClient } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Ressource, PermissionInsert, RoleAvecPermissions } from '@amap-togo/database'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditRolePage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [role, setRole] = useState<RoleAvecPermissions | null>(null)
  const [ressources, setRessources] = useState<Ressource[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [roleRes, ressourcesRes] = await Promise.all([
          supabaseClient
            .from('roles')
            .select(`
              *,
              permissions (
                *,
                ressource:ressources (*)
              )
            `)
            .eq('id', id)
            .single(),
          supabaseClient.from('ressources').select('*').order('ordre'),
        ])

        if (roleRes.error) throw roleRes.error
        setRole(roleRes.data as RoleAvecPermissions)
        setRessources(ressourcesRes.data || [])
      } catch (error) {
        console.error('Erreur:', error)
        router.push('/roles')
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [id, router])

  const handleSubmit = async (data: {
    nom: string
    description: string
    permissions: PermissionInsert[]
  }) => {
    if (!role) return

    setLoading(true)
    try {
      // Mettre a jour le role (si pas systeme)
      if (!role.est_systeme) {
        const { error: roleError } = await supabaseClient
          .from('roles')
          .update({
            nom: data.nom,
            description: data.description || null,
          })
          .eq('id', id)

        if (roleError) throw roleError
      }

      // Supprimer anciennes permissions (sauf admin)
      if (role.nom !== 'admin') {
        const { error: deleteError } = await supabaseClient
          .from('permissions')
          .delete()
          .eq('role_id', id)

        if (deleteError) throw deleteError

        // Creer nouvelles permissions
        if (data.permissions.length > 0) {
          const permsToInsert = data.permissions.map((p) => ({
            ...p,
            role_id: id,
          }))

          const { error: permsError } = await supabaseClient
            .from('permissions')
            .insert(permsToInsert)

          if (permsError) throw permsError
        }
      }

      router.push('/roles')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise a jour')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  if (!role) return null

  return (
    <AdminLayout>
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
            <h1 className="text-xl font-semibold text-gray-900">
              Modifier le role
            </h1>
            <p className="text-sm text-gray-500">{role.nom}</p>
          </div>
        </div>

        {/* Formulaire */}
        <RoleForm
          role={role}
          ressources={ressources}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/roles')}
          loading={loading}
        />
      </div>
    </AdminLayout>
  )
}
