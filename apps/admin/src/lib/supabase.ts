// Configuration du client Supabase pour l'admin
// Utilise le meme systeme de cookies que le front

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Client Supabase pour les composants client
 * Partage la session avec le front via cookies
 *
 * Configuration production :
 * - Cookies partages automatiquement sur le meme domaine
 * - Sessions synchronisees entre web et admin
 */
export const supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  cookieOptions: {
    name: 'sb-auth-token',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
})
