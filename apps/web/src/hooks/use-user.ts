// Hook pour recuperer l'utilisateur courant
// Utilise Supabase Auth avec systeme RBAC

'use client'

import { useState, useEffect, useRef } from 'react'
import { createClientBrowser } from '@amap-togo/database/browser'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string | null
  role_id: string | null
  role_nom: string | null
}

interface UseUserReturn {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
}

/**
 * Recupere le profil utilisateur avec son role
 */
async function fetchProfile(
  supabase: ReturnType<typeof createClientBrowser>,
  userId: string
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profils')
      .select(`
        id, nom, prenom, email, telephone, role_id,
        roles:role_id (nom)
      `)
      .eq('id', userId)
      .single()

    if (error || !data) {
      console.error('Erreur fetch profil:', error?.message)
      return null
    }

    interface ProfilData {
      id: string
      nom: string
      prenom: string
      email: string
      telephone: string | null
      role_id: string | null
      roles: { nom: string } | { nom: string }[] | null
    }
    const profil = data as ProfilData
    const rolesData = profil.roles
    const roleName = Array.isArray(rolesData) 
      ? rolesData[0]?.nom 
      : rolesData?.nom

    return {
      id: profil.id,
      nom: profil.nom,
      prenom: profil.prenom,
      email: profil.email,
      telephone: profil.telephone,
      role_id: profil.role_id,
      role_nom: roleName || null,
    }
  } catch (err) {
    console.error('Exception fetch profil:', err)
    return null
  }
}

/**
 * Hook pour recuperer l'utilisateur connecte
 * Compatible avec le systeme RBAC
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const initialLoadDone = useRef(false)

  useEffect(() => {
    const supabase = createClientBrowser()

    // Recuperer la session initiale
    const initUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        setUser(authUser)

        if (authUser) {
          const userProfile = await fetchProfile(supabase, authUser.id)
          if (userProfile) {
            setProfile(userProfile)
          }
        }
      } catch (error) {
        console.error('Erreur init utilisateur:', error)
      } finally {
        setLoading(false)
        initialLoadDone.current = true
      }
    }

    initUser()

    // Ecouter les changements d'auth (connexion/deconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Ignorer l'event initial car deja traite par initUser
        if (!initialLoadDone.current) return

        // Seulement reagir aux vrais changements
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          return
        }

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          const userProfile = await fetchProfile(supabase, session.user.id)
          if (userProfile) {
            setProfile(userProfile)
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const roleName = profile?.role_nom
  const isAdmin = roleName === 'admin'
  const isStaff = roleName === 'admin' || roleName === 'vendeur'

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isStaff,
  }
}
