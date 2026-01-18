// Types TypeScript pour le systeme RBAC
// Role-Based Access Control dynamique

/** Actions CRUD possibles */
export type CrudAction = 'create' | 'read' | 'update' | 'delete'

/** Role personnalise */
export interface Role {
  id: string
  nom: string
  description: string | null
  est_systeme: boolean
  actif: boolean
  created_at: string
  updated_at: string
}

export interface RoleInsert {
  nom: string
  description?: string | null
  est_systeme?: boolean
  actif?: boolean
}

export interface RoleUpdate {
  nom?: string
  description?: string | null
  actif?: boolean
}

/** Ressource admin (section) */
export interface Ressource {
  id: string
  code: string
  nom: string
  description: string | null
  icone: string | null
  ordre: number
  actif: boolean
  created_at: string
}

/** Permission role-ressource */
export interface Permission {
  id: string
  role_id: string
  ressource_id: string
  peut_creer: boolean
  peut_lire: boolean
  peut_modifier: boolean
  peut_supprimer: boolean
  created_at: string
  updated_at: string
}

export interface PermissionInsert {
  role_id: string
  ressource_id: string
  peut_creer?: boolean
  peut_lire?: boolean
  peut_modifier?: boolean
  peut_supprimer?: boolean
}

export interface PermissionUpdate {
  peut_creer?: boolean
  peut_lire?: boolean
  peut_modifier?: boolean
  peut_supprimer?: boolean
}

/** Permission avec ressource jointe */
export interface PermissionAvecRessource extends Permission {
  ressource: Ressource
}

/** Role avec ses permissions */
export interface RoleAvecPermissions extends Role {
  permissions: PermissionAvecRessource[]
}

/** Map permissions pour usage client (code ressource -> droits) */
export type PermissionsMap = Record<string, {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}>

/** Codes des ressources disponibles */
export type RessourceCode =
  | 'dashboard'
  | 'produits'
  | 'categories'
  | 'paniers_semaine'
  | 'paniers_types'
  | 'commandes'
  | 'profils'
  | 'diffusion'
  | 'roles'
  | 'utilisateurs'

/** Mapping ressource Refine -> code ressource */
export const REFINE_RESOURCE_MAP: Record<string, RessourceCode> = {
  produits: 'produits',
  categories: 'categories',
  commandes: 'commandes',
  profils: 'profils',
  clients: 'profils',
  paniers_semaine: 'paniers_semaine',
  paniers: 'paniers_semaine',
  paniers_types: 'paniers_types',
  diffusion: 'diffusion',
  roles: 'roles',
  utilisateurs: 'utilisateurs',
}

/** Mapping action Refine -> action CRUD */
export const REFINE_ACTION_MAP: Record<string, CrudAction> = {
  list: 'read',
  show: 'read',
  create: 'create',
  edit: 'update',
  delete: 'delete',
}
