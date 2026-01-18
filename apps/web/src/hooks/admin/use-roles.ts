// Hook pour la gestion des roles
// CRUD roles et permissions

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabaseClient } from '@/lib/supabase'
import type {
  Role,
  RoleInsert,
  RoleUpdate,
  Ressource,
  PermissionInsert,
  RoleAvecPermissions
} from '@amap-togo/database'

interface UseRolesReturn {
  roles: Role[]
  ressources: Ressource[]
  loading: boolean
  error: Error | null
  createRole: (data: RoleInsert) => Promise<Role | null>
  updateRole: (id: string, data: RoleUpdate) => Promise<boolean>
  deleteRole: (id: string) => Promise<boolean>
  getRoleWithPermissions: (id: string) => Promise<RoleAvecPermissions | null>
  updatePermissions: (roleId: string, perms: PermissionInsert[]) => Promise<boolean>
  refetch: () => Promise<void>
}

export function useRoles(): UseRolesReturn {
  const [roles, setRoles] = useState<Role[]>([])
  const [ressources, setRessources] = useState<Ressource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      const [rolesRes, ressourcesRes] = await Promise.all([
        supabaseClient.from('roles').select('*').order('nom'),
        supabaseClient.from('ressources').select('*').order('ordre'),
      ])

      if (rolesRes.error) throw rolesRes.error
      if (ressourcesRes.error) throw ressourcesRes.error

      setRoles(rolesRes.data || [])
      setRessources(ressourcesRes.data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const createRole = useCallback(async (data: RoleInsert): Promise<Role | null> => {
    const { data: role, error } = await supabaseClient
      .from('roles')
      .insert(data)
      .select()
      .single()

    if (error) {
      setError(error)
      return null
    }

    setRoles((prev) => [...prev, role])
    return role
  }, [])

  const updateRole = useCallback(async (id: string, data: RoleUpdate): Promise<boolean> => {
    const { error } = await supabaseClient
      .from('roles')
      .update(data)
      .eq('id', id)

    if (error) {
      setError(error)
      return false
    }

    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    )
    return true
  }, [])

  const deleteRole = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabaseClient
      .from('roles')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error)
      return false
    }

    setRoles((prev) => prev.filter((r) => r.id !== id))
    return true
  }, [])

  const getRoleWithPermissions = useCallback(
    async (id: string): Promise<RoleAvecPermissions | null> => {
      const { data, error } = await supabaseClient
        .from('roles')
        .select(`
          *,
          permissions (
            *,
            ressource:ressources (*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        setError(error)
        return null
      }

      return data as RoleAvecPermissions
    },
    []
  )

  const updatePermissions = useCallback(
    async (roleId: string, perms: PermissionInsert[]): Promise<boolean> => {
      // Supprimer anciennes permissions
      const { error: deleteError } = await supabaseClient
        .from('permissions')
        .delete()
        .eq('role_id', roleId)

      if (deleteError) {
        setError(deleteError)
        return false
      }

      // Inserer nouvelles permissions
      if (perms.length > 0) {
        const toInsert = perms.map((p) => ({ ...p, role_id: roleId }))
        const { error: insertError } = await supabaseClient
          .from('permissions')
          .insert(toInsert)

        if (insertError) {
          setError(insertError)
          return false
        }
      }

      return true
    },
    []
  )

  return {
    roles,
    ressources,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    getRoleWithPermissions,
    updatePermissions,
    refetch: fetchData,
  }
}
