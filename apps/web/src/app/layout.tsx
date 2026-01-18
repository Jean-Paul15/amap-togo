import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header, Footer } from '@/components/layout'
import { QueryProvider } from '@/providers'
import { POSModal } from '@/components/pos'

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
    'Produits bio et locaux livres a Lome. Paniers hebdomadaires.',
  keywords: [
    'AMAP',
    'bio',
    'agriculture',
    'Togo',
    'Lome',
    'produits locaux',
    'panier',
    'legumes',
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
      'Paniers hebdomadaires livres a Lome.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <QueryProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            {/* Spacer pour compenser le header fixed */}
            <div className="h-16 lg:h-20" aria-hidden="true" />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          {/* Modal POS global */}
          <POSModal />
        </QueryProvider>
      </body>
    </html>
  )
}
