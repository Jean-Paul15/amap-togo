// Middleware Next.js pour l'authentification
// Protege les routes /compte/*

import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@amap-togo/database/server'

// Routes protegees
const protectedRoutes = ['/compte']

export async function middleware(request: NextRequest) {
  // Mettre a jour la session Supabase
  const response = await updateSession(request)

  // Verifier si la route est protegee
  const { pathname } = request.nextUrl
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Verifier si l'utilisateur est connecte via les cookies
    const supabaseToken = request.cookies.get('sb-access-token')?.value ||
      request.cookies.get('sb-refresh-token')?.value

    // Si pas de token, rediriger vers l'accueil
    // Le modal de connexion s'ouvrira
    if (!supabaseToken) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('auth', 'required')
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation images)
     * - favicon.ico (favicon)
     * - images publiques
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
