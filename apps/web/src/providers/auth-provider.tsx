// Provider global d'authentification avec hydratation SSR
// Les donnees auth sont chargees cote serveur

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
  } catch {
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
 * Si des donnees SSR sont fournies, loading est false immediatement
 */
export function AuthProvider({ 
  children, 
  initialUser, 
  initialProfile 
}: AuthProviderProps) {
  // Si on a des donnees SSR, on demarre avec loading=false
  const hasSSRData = initialUser !== undefined
  const [user, setUser] = useState<User | null>(
    initialUser ? { id: initialUser.id, email: initialUser.email } as User : null
  )
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile || null)
  const [loading, setLoading] = useState(!hasSSRData)
  const initialLoadDone = useRef(hasSSRData)
  const supabaseRef = useRef<ReturnType<typeof createClientBrowser> | null>(null)

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
      const userProfile = await fetchProfile(supabase, authUser.id)
      if (userProfile) {
        setProfile(userProfile)
      }
    }
  }

  const signOut = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    window.location.href = '/'
  }

  useEffect(() => {
    const supabase = getSupabase()

    // Revalidation au focus de la fenetre
    const handleFocus = () => {
      if (initialLoadDone.current) {
        refreshProfile()
      }
    }
    window.addEventListener('focus', handleFocus)

    // Si pas de donnees SSR, charger cote client
    const initUser = async () => {
      if (hasSSRData) {
        initialLoadDone.current = true
        // Revalidation silencieuse en arriere-plan
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          setUser(authUser)
          const userProfile = await fetchProfile(supabase, authUser.id)
          if (userProfile) {
            setProfile(userProfile)
          }
        } else if (initialUser) {
          // Session expiree cote serveur mais SSR avait un user
          setUser(null)
          setProfile(null)
        }
        return
      }

      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        setUser(authUser)

        if (authUser) {
          const userProfile = await fetchProfile(supabase, authUser.id)
          if (userProfile) {
            setProfile(userProfile)
          }
        }
      } catch {
        // Silencieux
      } finally {
        setLoading(false)
        initialLoadDone.current = true
      }
    }

    initUser()

    // Ecouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!initialLoadDone.current) return

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          return
        }

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await new Promise(resolve => setTimeout(resolve, 500))
          const userProfile = await fetchProfile(supabase, session.user.id)
          if (userProfile) {
            setProfile(userProfile)
          }
        }
      }
    )

    return () => {
      window.removeEventListener('focus', handleFocus)
      subscription.unsubscribe()
    }
  }, [hasSSRData, initialUser])

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
