// Client Supabase pour les composants client (browser)
// Utilise @supabase/ssr pour la gestion des cookies

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

/**
 * Cree un client Supabase pour les composants client
 * A utiliser dans les hooks et composants avec 'use client'
 *
 * Configuration pour production :
 * - Cookies partages entre web et admin sur le meme domaine
 * - Session automatiquement synchronisee
 */
export function createClientBrowser() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // Important : pas de domain specifique en local
        // En production sur Vercel, les sous-domaines partagent automatiquement
        name: 'sb-auth-token',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    }
  )
}
