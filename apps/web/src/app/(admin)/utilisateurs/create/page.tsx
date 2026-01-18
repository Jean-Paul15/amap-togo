// Page creation utilisateur
// Cree compte Supabase Auth + profil

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserForm } from '@/components/admin/rbac'
import { supabaseClient } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Role } from '@amap-togo/database'

export default function CreateUtilisateurPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    async function fetchRoles() {
      const { data } = await supabaseClient
        .from('roles')
        .select('*')
        .eq('actif', true)
        .order('nom')
      setRoles(data || [])
      setLoadingData(false)
    }
    fetchRoles()
  }, [])

  const handleSubmit = async (data: {
    email: string
    password: string
    nom: string
    prenom: string
    telephone: string
    role_id: string
  }) => {
    setLoading(true)
    try {
      // Appeler l'API route pour creer l'utilisateur
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la creation')
      }

      router.push('/utilisateurs')
    } catch (error) {
      console.error('Erreur:', error)
      alert(error instanceof Error ? error.message : 'Erreur lors de la creation')
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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/utilisateurs"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Nouvel utilisateur
            </h1>
            <p className="text-sm text-gray-500">
              Creez un compte avec un role assigne
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <UserForm
          roles={roles}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/utilisateurs')}
          loading={loading}
        />
      </div>
  )
}
