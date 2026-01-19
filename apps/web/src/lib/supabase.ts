// Configuration du client Supabase pour l'admin
// Client navigateur pour les composants client

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Client Supabase pour les composants client admin
 * Utilise la configuration par defaut de @supabase/ssr
 * pour un partage correct des cookies avec le middleware
 */
export const supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
