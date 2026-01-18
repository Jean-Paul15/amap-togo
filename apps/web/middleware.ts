// Middleware unifie Next.js pour l'authentification
// Protege les routes /compte/* et les routes admin

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Routes protegees pour les utilisateurs connectes
const USER_PROTECTED_ROUTES = ['/compte']

// Routes admin protegees par RBAC
const ADMIN_ROUTES = [
  '/dashboard',
  '/categories',
  '/clients',
  '/commandes',
  '/diffusion',
  '/paniers-admin',
  '/paniers-types',
  '/produits-admin',
  '/roles',
  '/utilisateurs',
]

// Mapping des routes vers les codes de ressources RBAC
const ROUTE_RESOURCE_MAP: Record<string, string> = {
  '/produits-admin': 'produits',
  '/categories': 'categories',
  '/paniers-admin': 'paniers',
  '/paniers-types': 'paniers',
  '/commandes': 'commandes',
  '/clients': 'clients',
  '/roles': 'roles',
  '/diffusion': 'diffusion',
  '/utilisateurs': 'utilisateurs',
}

// Routes admin publiques (accessibles si connecte avec un role)
const ADMIN_PUBLIC_ROUTES = ['/dashboard', '/unauthorized']

export async function middleware(request: NextRequest) {
  // Verifier que les variables d'environnement sont configurees
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Variables d\'environnement Supabase manquantes')
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { pathname } = request.nextUrl

    // Verifier si c'est une route admin
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))
    
    // Verifier si c'est une route utilisateur protegee
    const isUserProtectedRoute = USER_PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    )

    // Si ce n'est ni admin ni protege, laisser passer
    if (!isAdminRoute && !isUserProtectedRoute) {
      return response
    }

    // Verifier l'utilisateur connecte
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Route utilisateur protegee : rediriger vers accueil si pas connecte
    if (isUserProtectedRoute && (!user || authError)) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('auth', 'required')
      return NextResponse.redirect(url)
    }

    // Route admin : verifier authentification et permissions
    if (isAdminRoute) {
      // Si pas connecte : rediriger vers accueil avec demande de connexion
      if (!user || authError) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        url.searchParams.set('auth', 'admin')
        url.searchParams.set('redirect', request.url)
        return NextResponse.redirect(url)
      }

      // Verifier le profil et les permissions RBAC
      const { data: profil, error: profilError } = await supabase
        .from('profils')
        .select(`
          role_id,
          roles:role_id (
            nom,
            permissions (
              peut_lire,
              ressources:ressource_id (code)
            )
          )
        `)
        .eq('id', user.id)
        .single()

      // Si pas de profil : acces refuse
      if (!profil || profilError) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        url.searchParams.set('error', 'no-admin-access')
        return NextResponse.redirect(url)
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const roleData = profil?.roles as any

      // Si pas de role assigne : acces refuse
      if (!roleData) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Dashboard et routes publiques admin : accessibles si connecte
      if (ADMIN_PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return response
      }

      // Trouver la ressource correspondant a cette route
      const routeKey = Object.keys(ROUTE_RESOURCE_MAP).find(
        key => pathname.startsWith(key)
      )

      if (routeKey) {
        const resourceCode = ROUTE_RESOURCE_MAP[routeKey]

        // Admin a toujours acces a tout
        if (roleData?.nom === 'admin') {
          return response
        }

        // Verifier si le role a la permission de lire cette ressource
        const permissions = roleData?.permissions || []
        const hasAccess = permissions.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (p: any) => p.ressources?.code === resourceCode && p.peut_lire
        )

        if (hasAccess) {
          return response
        }

        // Pas d'acces : rediriger vers dashboard ou unauthorized
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Erreur middleware:', error)
    return response
  }
}

export const config = {
  matcher: [
    // Toutes les routes sauf les fichiers statiques
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
