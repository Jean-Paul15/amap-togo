import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider, AuthProvider } from '@/providers'
import { ProductsProvider } from '@/components/providers/products-provider'
import { ToastProvider } from '@/components/ui/toast'
import { CookieBanner } from '@/components/cookies/cookie-banner'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { getProductsData } from '@/lib/ssr/get-products'
import { getAuthData } from '@/lib/ssr/get-auth'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2D5A27',
}

export const metadata: Metadata = {
  title: {
    default: 'AMAP TOGO - Produits Bio et Locaux',
    template: '%s | AMAP TOGO',
  },
  description: 
    'Association pour le Maintien d\'une Agriculture Paysanne au Togo. ' +
    'Produits bio et locaux livrés à Lomé. Paniers hebdomadaires.',
  keywords: [
    'AMAP',
    'bio',
    'agriculture',
    'Togo',
    'Lomé',
    'produits locaux',
    'panier',
    'légumes',
    'fruits',
  ],
  authors: [{ name: 'AMAP TOGO' }],
  creator: 'AMAP TOGO',
  openGraph: {
    type: 'website',
    locale: 'fr_TG',
    url: 'https://amaptogo.org',
    siteName: 'AMAP TOGO',
    title: 'AMAP TOGO - Produits Bio et Locaux',
    description: 
      'Produits agricoles bio et locaux au Togo. ' +
      'Paniers hebdomadaires livrés à Lomé.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMAP TOGO - Produits Bio et Locaux',
    description: 'Produits agricoles bio et locaux au Togo.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

// Forcer le rendu dynamique pour l'authentification
export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Charger les donnees cote serveur (SSR) en parallele
  const [productsData, authData] = await Promise.all([
    getProductsData(),
    getAuthData(),
  ])

  return (
    <html lang="fr" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <GoogleAnalytics />
        <QueryProvider>
          <AuthProvider
            initialUser={authData.user}
            initialProfile={authData.profile}
          >
            <ProductsProvider
              initialProducts={productsData.produits}
              initialCategories={productsData.categories}
            >
              <ToastProvider>
                {children}
                <CookieBanner />
              </ToastProvider>
            </ProductsProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
