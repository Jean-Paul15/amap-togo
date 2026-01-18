// Client Supabase pour les composants client (browser)
// Utilise @supabase/ssr pour la gestion des cookies

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

/**
 * Cree un client Supabase pour les composants client
 * A utiliser dans les hooks et composants avec 'use client'
 */
export function createClientBrowser() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
