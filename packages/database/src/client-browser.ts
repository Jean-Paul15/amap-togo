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
  // Extraire le domaine principal en production pour partager les cookies entre sous-domaines
  const cookieDomain = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_COOKIE_DOMAIN
    ? process.env.NEXT_PUBLIC_COOKIE_DOMAIN
    : undefined

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: 'sb-auth-token',
        // En production : .amap-togo.com (avec le point) pour partager entre sous-domaines
        // En local : undefined pour utiliser localhost
        domain: cookieDomain || undefined,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    }
  )
}
