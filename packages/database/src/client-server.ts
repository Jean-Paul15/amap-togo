// Client Supabase pour les composants serveur (RSC)
// Utilise @supabase/ssr pour la gestion des cookies cote serveur

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

/**
 * Cree un client Supabase pour les composants serveur
 * A utiliser dans les Server Components et Server Actions
 */
export async function createClientServer() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Ignore dans les Server Components (lecture seule)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Ignore dans les Server Components (lecture seule)
          }
        },
      },
    }
  )
}
