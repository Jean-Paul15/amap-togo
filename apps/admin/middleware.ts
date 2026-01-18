// Middleware admin pour l'authentification
// Verifie les permissions RBAC et redirige intelligemment

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// URL du front pour la connexion
const FRONT_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Mapping des routes vers les codes de ressources RBAC
const ROUTE_RESOURCE_MAP: Record<string, string> = {
  '/produits': 'produits',
  '/categories': 'categories',
  '/paniers': 'paniers',
  '/paniers-types': 'paniers',
  '/commandes': 'commandes',
  '/clients': 'clients',
  '/roles': 'roles',
  '/diffusion': 'diffusion',
  '/pos': 'pos',
  '/utilisateurs': 'utilisateurs',
}

// Routes publiques accessibles UNIQUEMENT si connecte
const PUBLIC_ROUTES = ['/unauthorized']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const pathname = request.nextUrl.pathname

  // Verifier l'utilisateur connecte
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Si pas d'utilisateur ou erreur auth : redirection immediate
  if (!user || authError) {
    const loginUrl = new URL(FRONT_URL)
    loginUrl.searchParams.set('auth', 'admin')
    loginUrl.searchParams.set('redirect', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Verifier que l'utilisateur a un profil dans la base
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

  // Si pas de profil : redirection vers le front (utilisateur non autorise)
  if (!profil || profilError) {
    const loginUrl = new URL(FRONT_URL)
    loginUrl.searchParams.set('error', 'no-admin-access')
    return NextResponse.redirect(loginUrl)
  }

  // Extraire le role et ses permissions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roleData = profil?.roles as any

  // Si pas de role assigne : acces refuse
  if (!roleData) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Page d'accueil : toujours accessible si connecte avec un role
  if (pathname === '/') {
    return response
  }

  // Routes publiques : accessibles si connecte
  if (PUBLIC_ROUTES.includes(pathname)) {
    return response
  }

  // Trouver la ressource correspondant a cette route
  const routeKey = Object.keys(ROUTE_RESOURCE_MAP).find(
    key => pathname.startsWith(key)
  )

  // Si pas de mapping de ressource : bloquer par defaut (securite)
  if (!routeKey) {
    // Routes API : laisser passer (gerees par les composants)
    if (pathname.startsWith('/api/')) {
      return response
    }
    // Autres routes non mappees : rediriger vers accueil
    return NextResponse.redirect(new URL('/', request.url))
  }

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

  // Pas d'acces : trouver une page accessible
  const accessibleResources = permissions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((p: any) => p.peut_lire && p.ressources?.code)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((p: any) => p.ressources.code)

  // Trouver la premiere route accessible
  const firstAccessibleRoute = Object.entries(ROUTE_RESOURCE_MAP).find(
    ([, code]) => accessibleResources.includes(code)
  )

  if (firstAccessibleRoute) {
    return NextResponse.redirect(new URL(firstAccessibleRoute[0], request.url))
  }

  // Aucune permission : rediriger vers page unauthorized
  return NextResponse.redirect(new URL('/unauthorized', request.url))
}

export const config = {
  matcher: [
    // Toutes les routes sauf les fichiers statiques
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
