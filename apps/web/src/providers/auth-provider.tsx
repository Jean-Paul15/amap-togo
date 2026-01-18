// Provider global d'authentification avec hydratation SSR
// Gere l'etat de connexion de maniere fiable

'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { createClientBrowser } from '@amap-togo/database/browser'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string | null
  role_id: string | null
  role_nom: string | null
}

export interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

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

interface AuthProviderProps {
  children: ReactNode
  initialUser?: { id: string; email: string } | null
  initialProfile?: UserProfile | null
}

/**
 * Provider d'authentification avec hydratation SSR
 */
export function AuthProvider({ 
  children, 
  initialUser, 
  initialProfile 
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabaseRef = useRef<ReturnType<typeof createClientBrowser> | null>(null)
  const hasHydrated = useRef(false)

  const getSupabase = () => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClientBrowser()
    }
    return supabaseRef.current
  }

  const refreshProfile = async () => {
    const supabase = getSupabase()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      setUser(authUser)
      const userProfile = await fetchProfile(supabase, authUser.id)
      if (userProfile) {
        setProfile(userProfile)
      }
    } else {
      setUser(null)
      setProfile(null)
    }
  }

  const signOut = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    window.location.href = '/'
  }

  // Hydratation initiale avec donnees SSR puis verification
  useEffect(() => {
    if (hasHydrated.current) return
    hasHydrated.current = true

    const supabase = getSupabase()

    const init = async () => {
      // Si on a des donnees SSR, les utiliser immediatement
      if (initialUser && initialProfile) {
        setUser({ id: initialUser.id, email: initialUser.email } as User)
        setProfile(initialProfile)
        setLoading(false)
      }

      // Toujours verifier l'etat reel cote client
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        setUser(authUser)
        const userProfile = await fetchProfile(supabase, authUser.id)
        if (userProfile) {
          setProfile(userProfile)
        }
      } else {
        // Pas d'utilisateur authentifie
        setUser(null)
        setProfile(null)
      }
      
      setLoading(false)
    }

    init()

    // Ecouter les changements d'auth en temps reel
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email)

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          return
        }

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
          setUser(session.user)
          // Attendre un peu pour le trigger qui cree le profil
          await new Promise(resolve => setTimeout(resolve, 300))
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
  }, [initialUser, initialProfile])

  const roleName = profile?.role_nom
  const isAdmin = roleName === 'admin'
  const isStaff = roleName === 'admin' || roleName === 'vendeur'

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isStaff,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook pour acceder au contexte d'auth
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext doit etre utilise dans un AuthProvider')
  }
  return context
}
