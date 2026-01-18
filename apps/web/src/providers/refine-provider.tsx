// Provider Refine pour le back-office
// Configure les ressources et le controle d'acces RBAC

'use client'

import { Refine, type AccessControlProvider } from '@refinedev/core'
import routerProvider from '@refinedev/nextjs-router'
import { dataProvider, liveProvider } from '@refinedev/supabase'
import { supabaseClient } from '@/lib/supabase'
import {
  ShoppingBag,
  Package,
  Users,
  ShoppingCart,
  Layers,
  Shield,
  UserCog,
  Mail
} from 'lucide-react'
import {
  REFINE_RESOURCE_MAP,
  REFINE_ACTION_MAP,
  type CrudAction,
  type RessourceCode
} from '@amap-togo/database'

interface RefineProviderProps {
  children: React.ReactNode
}

// Cache permissions en memoire
let permissionsCache: Record<string, { create: boolean; read: boolean; update: boolean; delete: boolean }> | null = null

async function loadPermissions() {
  if (permissionsCache !== null) return permissionsCache

  try {
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) return {}

    const { data: profil } = await supabaseClient
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

    const permMap: Record<string, { create: boolean; read: boolean; update: boolean; delete: boolean }> = {}

    // Supabase retourne un objet pour les relations single
    const roleData = profil?.roles as unknown as {
      nom: string
      permissions: Array<{
        peut_creer: boolean
        peut_lire: boolean
        peut_modifier: boolean
        peut_supprimer: boolean
        ressources: { code: string }
      }>
    } | null

    if (roleData?.permissions) {
      for (const perm of roleData.permissions) {
        if (perm.ressources?.code) {
          permMap[perm.ressources.code] = {
            create: perm.peut_creer,
            read: perm.peut_lire,
            update: perm.peut_modifier,
            delete: perm.peut_supprimer,
          }
        }
      }
    }

    permissionsCache = permMap
    return permMap
  } catch {
    return {}
  }
}

// AccessControlProvider pour Refine
const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const permissions = await loadPermissions()

    // Mapper ressource Refine vers code ressource
    const ressourceCode = resource ? (REFINE_RESOURCE_MAP[resource] || resource) : null
    if (!ressourceCode) return { can: true }

    // Mapper action Refine vers action CRUD
    const crudAction: CrudAction = REFINE_ACTION_MAP[action] || 'read'

    const perm = permissions[ressourceCode as RessourceCode]
    if (!perm) return { can: false, reason: 'Ressource non configuree' }

    const canDo = perm[crudAction]
    return {
      can: canDo,
      reason: canDo ? undefined : 'Permission refusee',
    }
  },
}

/**
 * Provider Refine avec configuration complete et RBAC
 */
export function RefineProvider({ children }: RefineProviderProps) {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider(supabaseClient)}
      liveProvider={liveProvider(supabaseClient)}
      accessControlProvider={accessControlProvider}
      resources={[
        {
          name: 'produits',
          list: '/produits',
          create: '/produits/create',
          edit: '/produits/:id/edit',
          show: '/produits/:id',
          meta: {
            label: 'Produits',
            icon: <Package className="w-4 h-4" />,
          },
        },
        {
          name: 'categories',
          list: '/categories',
          create: '/categories/create',
          edit: '/categories/:id/edit',
          meta: {
            label: 'Categories',
            icon: <Layers className="w-4 h-4" />,
          },
        },
        {
          name: 'commandes',
          list: '/commandes',
          show: '/commandes/:id',
          edit: '/commandes/:id/edit',
          meta: {
            label: 'Commandes',
            icon: <ShoppingCart className="w-4 h-4" />,
          },
        },
        {
          name: 'profils',
          list: '/clients',
          show: '/clients/:id',
          edit: '/clients/:id/edit',
          meta: {
            label: 'Clients',
            icon: <Users className="w-4 h-4" />,
          },
        },
        {
          name: 'paniers_semaine',
          list: '/paniers',
          create: '/paniers/create',
          edit: '/paniers/:id/edit',
          meta: {
            label: 'Paniers',
            icon: <ShoppingBag className="w-4 h-4" />,
          },
        },
        {
          name: 'diffusion',
          list: '/diffusion',
          meta: {
            label: 'Emails',
            icon: <Mail className="w-4 h-4" />,
          },
        },
        {
          name: 'roles',
          list: '/roles',
          create: '/roles/create',
          edit: '/roles/:id/edit',
          meta: {
            label: 'Roles',
            icon: <Shield className="w-4 h-4" />,
          },
        },
        {
          name: 'utilisateurs',
          list: '/utilisateurs',
          create: '/utilisateurs/create',
          meta: {
            label: 'Utilisateurs',
            icon: <UserCog className="w-4 h-4" />,
          },
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      {children}
    </Refine>
  )
}

// Reset cache (appeler lors de la deconnexion)
export function resetPermissionsCache() {
  permissionsCache = null
}
