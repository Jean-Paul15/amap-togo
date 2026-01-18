import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { RefineProvider } from '@/providers/refine-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AMAP TOGO - Back-Office',
  description: 'Gestion des produits, commandes et clients AMAP TOGO',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <RefineProvider>
          {children}
        </RefineProvider>
      </body>
    </html>
  )
}
