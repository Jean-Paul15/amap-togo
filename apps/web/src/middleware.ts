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
// Les codes doivent correspondre a la table ressources dans la BDD
const ROUTE_RESOURCE_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/produits-admin': 'produits',
  '/categories': 'categories',
  '/paniers-admin': 'paniers_semaine',
  '/paniers-types': 'paniers_types',
  '/commandes': 'commandes',
  '/clients': 'profils',
  '/roles': 'roles',
  '/diffusion': 'diffusion',
  '/utilisateurs': 'utilisateurs',
}

// Route unauthorized (pas de verification RBAC, juste etre connecte)
const NO_RBAC_ROUTES = ['/unauthorized']

// Mapping inverse : ressource -> route
const RESOURCE_ROUTE_MAP: Record<string, string> = {
  'dashboard': '/dashboard',
  'produits': '/produits-admin',
  'categories': '/categories',
  'paniers_semaine': '/paniers-admin',
  'paniers_types': '/paniers-types',
  'commandes': '/commandes',
  'profils': '/clients',
  'roles': '/roles',
  'diffusion': '/diffusion',
  'utilisateurs': '/utilisateurs',
}

// Ordre de priorite pour la redirection (routes les plus utiles en premier)
const ROUTE_PRIORITY = [
  'dashboard',
  'commandes',
  'produits',
  'paniers_semaine',
  'categories',
  'profils',
  'diffusion',
  'roles',
  'utilisateurs',
  'paniers_types',
]

/**
 * Trouve la premiere route accessible pour l'utilisateur
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findFirstAccessibleRoute(permissions: any[]): string | null {
  for (const resourceCode of ROUTE_PRIORITY) {
    const hasAccess = permissions.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.ressources?.code === resourceCode && p.peut_lire
    )
    if (hasAccess && RESOURCE_ROUTE_MAP[resourceCode]) {
      return RESOURCE_ROUTE_MAP[resourceCode]
    }
  }
  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verifier si c'est une route admin
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))
  
  // Verifier si c'est une route utilisateur protegee
  const isUserProtectedRoute = USER_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  
  // Si ce n'est ni admin ni protege, laisser passer sans creer de client Supabase
  if (!isAdminRoute && !isUserProtectedRoute) {
    return NextResponse.next()
  }
  
  // Verifier que les variables d'environnement sont configurees
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
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
        url.searchParams.set('redirect', pathname)
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

      // Route unauthorized : accessible si connecte (meme sans permissions)
      if (NO_RBAC_ROUTES.some(route => pathname.startsWith(route))) {
        return response
      }

      // Recuperer toutes les permissions de l'utilisateur
      const permissions = roleData?.permissions || []
      
      // Trouver la ressource correspondant a cette route
      const routeKey = Object.keys(ROUTE_RESOURCE_MAP).find(
        key => pathname.startsWith(key)
      )

      if (routeKey) {
        const resourceCode = ROUTE_RESOURCE_MAP[routeKey]

        // Verifier si le role a la permission de lire cette ressource
        const hasAccess = permissions.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (p: any) => p.ressources?.code === resourceCode && p.peut_lire
        )

        if (hasAccess) {
          return response
        }

        // Pas d'acces : chercher une page accessible
        const accessibleRoute = findFirstAccessibleRoute(permissions)
        
        if (accessibleRoute) {
          // Rediriger vers la page accessible avec un toast d'erreur
          const url = request.nextUrl.clone()
          url.pathname = accessibleRoute
          url.searchParams.set('access_denied', '1')
          return NextResponse.redirect(url)
        }
        
        // Aucune page accessible : rediriger vers unauthorized
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
      
      // Route admin non mappee : rediriger vers unauthorized par securite
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return response
  } catch {
    // En cas d'erreur, rediriger vers l'accueil pour les routes admin
    if (isAdminRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('error', 'middleware-error')
      return NextResponse.redirect(url)
    }
    return response
  }
}

export const config = {
  matcher: [
    // Toutes les routes sauf les fichiers statiques
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
