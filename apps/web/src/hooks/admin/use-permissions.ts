// Hook pour gerer les permissions de l'utilisateur courant
// Utilise le systeme RBAC dynamique

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabaseClient } from '@/lib/supabase'
import type { PermissionsMap, CrudAction, RessourceCode } from '@amap-togo/database'

interface UsePermissionsReturn {
  permissions: PermissionsMap
  loading: boolean
  error: Error | null
  isAdmin: boolean
  canAccess: (ressource: RessourceCode, action: CrudAction) => boolean
  refetch: () => Promise<void>
}

export function usePermissions(): UsePermissionsReturn {
  const [permissions, setPermissions] = useState<PermissionsMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true)

      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) {
        setError(new Error('Non authentifie'))
        setLoading(false)
        return
      }

      const { data: profil, error: profilError } = await supabaseClient
        .from('profils')
        .select(`
          role_id,
          roles:role_id (
            id,
            nom,
            permissions (
              peut_creer,
              peut_lire,
              peut_modifier,
              peut_supprimer,
              ressources:ressource_id (code)
            )
          )
        `)
        .eq('id', user.id)
        .single()

      if (profilError) {
        setError(profilError)
        setLoading(false)
        return
      }

      const permMap: PermissionsMap = {}
      const role = profil?.roles as unknown as { nom: string; permissions: Array<{
        peut_creer: boolean
        peut_lire: boolean
        peut_modifier: boolean
        peut_supprimer: boolean
        ressources: { code: string }
      }> } | null

      if (role?.permissions) {
        for (const perm of role.permissions) {
          if (perm.ressources?.code) {
            permMap[perm.ressources.code] = {
              create: perm.peut_creer,
              read: perm.peut_lire,
              update: perm.peut_modifier,
              delete: perm.peut_supprimer,
            }
          }
        }
        setIsAdmin(role.nom === 'admin')
      }

      setPermissions(permMap)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  const canAccess = useCallback(
    (ressource: RessourceCode, action: CrudAction): boolean => {
      if (isAdmin) return true
      const perm = permissions[ressource]
      if (!perm) return false

      switch (action) {
        case 'create': return perm.create
        case 'read': return perm.read
        case 'update': return perm.update
        case 'delete': return perm.delete
        default: return false
      }
    },
    [permissions, isAdmin]
  )

  return useMemo(() => ({
    permissions,
    loading,
    error,
    isAdmin,
    canAccess,
    refetch: fetchPermissions,
  }), [permissions, loading, error, isAdmin, canAccess, fetchPermissions])
}
