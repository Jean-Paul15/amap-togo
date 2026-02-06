// Chargement SSR de l'utilisateur connecte
// Execute cote serveur pour avoir l'etat auth au premier rendu

import { createClientServer } from '@amap-togo/database/server'

export interface UserProfile {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string | null
  role_id: string | null
  role_nom: string | null
  avatar_url: string | null
}

export interface AuthData {
  user: { id: string; email: string } | null
  profile: UserProfile | null
}

/**
 * Charge l'utilisateur et son profil cote serveur
 * Appele dans le layout pour SSR
 */
export async function getAuthData(): Promise<AuthData> {
  try {
    const supabase = await createClientServer()

    // Recuperer l'utilisateur connecte
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { user: null, profile: null }
    }

    // Recuperer le profil avec le role
    const { data: profil } = await supabase
      .from('profils')
      .select(`
        id, nom, prenom, email, telephone, role_id, avatar_url,
        roles:role_id (nom)
      `)
      .eq('id', user.id)
      .single()

    if (!profil) {
      return {
        user: { id: user.id, email: user.email || '' },
        profile: null
      }
    }

    interface ProfilData {
      id: string
      nom: string
      prenom: string
      email: string
      telephone: string | null
      role_id: string | null
      avatar_url: string | null
      roles: { nom: string } | { nom: string }[] | null
    }
    const profilData = profil as ProfilData
    const rolesData = profilData.roles
    const roleName = Array.isArray(rolesData)
      ? rolesData[0]?.nom
      : rolesData?.nom

    return {
      user: { id: user.id, email: user.email || '' },
      profile: {
        id: profilData.id,
        nom: profilData.nom,
        prenom: profilData.prenom,
        email: profilData.email,
        telephone: profilData.telephone,
        role_id: profilData.role_id,
        role_nom: roleName || null,
        avatar_url: profilData.avatar_url,
      },
    }
  } catch (err) {
    console.error('Erreur SSR auth:', err)
    return { user: null, profile: null }
  }
}
