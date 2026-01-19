// Helpers pour verifier les permissions RBAC dans les Server Actions
// Utilise les fonctions RLS de la base de donnees

import { createClientServer } from '@amap-togo/database/server'

export type Permission = 'creer' | 'lire' | 'modifier' | 'supprimer'

interface PermissionResult {
  hasAccess: boolean
  userId: string | null
  error: string | null
}

/**
 * Verifie si l'utilisateur a la permission sur une ressource
 * A utiliser dans les Server Actions
 */
export async function checkPermission(
  resourceCode: string,
  permission: Permission
): Promise<PermissionResult> {
  try {
    const supabase = await createClientServer()
    
    // Récupérer l'utilisateur connecté
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!user || authError) {
      return {
        hasAccess: false,
        userId: null,
        error: 'Non authentifié',
      }
    }
    
    // Récupérer le profil avec le rôle et les permissions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profil, error: profilError } = await supabase
      .from('profils')
      .select(`
        role_id,
        roles:role_id (
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
      .single() as { data: { role_id: string | null; roles: unknown } | null; error: unknown }
    
    if (!profil || profilError) {
      return {
        hasAccess: false,
        userId: user.id,
        error: 'Profil non trouvé',
      }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roleData = profil.roles as any
    
    if (!roleData) {
      return {
        hasAccess: false,
        userId: user.id,
        error: 'Aucun rôle assigné',
      }
    }
    
    // Mapper le type de permission vers la colonne
    const permissionColumn = {
      'creer': 'peut_creer',
      'lire': 'peut_lire',
      'modifier': 'peut_modifier',
      'supprimer': 'peut_supprimer',
    }[permission]
    
    // Verifier la permission
    const permissions = roleData?.permissions || []
    const hasAccess = permissions.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.ressources?.code === resourceCode && p[permissionColumn]
    )
    
    return {
      hasAccess,
      userId: user.id,
      error: hasAccess ? null : `Permission ${permission} refusée sur ${resourceCode}`,
    }
  } catch (error) {
    return {
      hasAccess: false,
      userId: null,
      error: `Erreur vérification permission: ${error}`,
    }
  }
}

/**
 * Verifie si l'utilisateur est staff (admin ou vendeur)
 */
export async function checkIsStaff(): Promise<PermissionResult> {
  try {
    const supabase = await createClientServer()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!user || authError) {
      return {
        hasAccess: false,
        userId: null,
        error: 'Non authentifié',
      }
    }
    
    // Utiliser la fonction RLS is_staff_user
    const { data: isStaff } = await supabase.rpc('is_staff_user')
    
    return {
      hasAccess: !!isStaff,
      userId: user.id,
      error: isStaff ? null : 'Accès staff requis',
    }
  } catch (error) {
    return {
      hasAccess: false,
      userId: null,
      error: `Erreur vérification staff: ${error}`,
    }
  }
}

/**
 * Verifie si l'utilisateur est admin
 */
export async function checkIsAdmin(): Promise<PermissionResult> {
  try {
    const supabase = await createClientServer()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!user || authError) {
      return {
        hasAccess: false,
        userId: null,
        error: 'Non authentifié',
      }
    }
    
    // Utiliser la fonction RLS is_admin_user
    const { data: isAdmin } = await supabase.rpc('is_admin_user')
    
    return {
      hasAccess: !!isAdmin,
      userId: user.id,
      error: isAdmin ? null : 'Accès admin requis',
    }
  } catch (error) {
    return {
      hasAccess: false,
      userId: null,
      error: `Erreur vérification admin: ${error}`,
    }
  }
}
