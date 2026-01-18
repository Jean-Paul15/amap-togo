// Configuration du client Supabase pour l'admin
// Client navigateur pour les composants client

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Client Supabase pour les composants client admin
 * Partage automatiquement les cookies d'authentification
 */
export const supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  cookieOptions: {
    name: 'sb-auth-token',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
})
