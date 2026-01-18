// Hook pour les actions d'authentification
// Connexion, deconnexion

'use client'

import { createClientBrowser } from '@amap-togo/database/browser'

/**
 * Hook pour les actions d'authentification
 */
export function useAuth() {
  const signOut = async () => {
    const supabase = createClientBrowser()
    
    // Deconnecter proprement
    await supabase.auth.signOut()
    
    // Recharger la page pour vider le cache et les cookies
    window.location.href = '/'
  }

  return {
    signOut,
  }
}
