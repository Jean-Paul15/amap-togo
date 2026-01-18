// Hook pour les actions d'authentification
// Utilise le contexte global AuthProvider

'use client'

import { useAuthContext } from '@/providers'

/**
 * Hook pour les actions d'authentification
 */
export function useAuth() {
  const { signOut } = useAuthContext()

  return {
    signOut,
  }
}
