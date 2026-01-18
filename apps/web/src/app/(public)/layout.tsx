/**
 * Layout pour les pages publiques (site vitrine)
 * Inclut Header, Footer et modal POS
 */

import { Header, Footer } from '@/components/layout'
import { POSModal } from '@/components/pos'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Spacer pour compenser le header fixed */}
      <div className="h-16 lg:h-20" aria-hidden="true" />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Modal POS global pour les ventes rapides */}
      <POSModal />
    </div>
  )
}
