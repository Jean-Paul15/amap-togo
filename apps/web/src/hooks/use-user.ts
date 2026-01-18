// Hook pour recuperer l'utilisateur courant
// Utilise le contexte global AuthProvider

'use client'

import { useAuthContext } from '@/providers'
import type { AuthContextValue } from '@/providers'

/**
 * Hook pour recuperer l'utilisateur connecte
 * Utilise le contexte global pour eviter les requetes multiples
 */
export function useUser(): AuthContextValue {
  return useAuthContext()
}
