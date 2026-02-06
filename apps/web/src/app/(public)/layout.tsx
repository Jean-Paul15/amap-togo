/**
 * Layout pour les pages publiques (site vitrine)
 * Inclut Header, Footer, modal POS et effets de scroll
 */

import { Header, Footer } from '@/components/layout'
import { ScrollEffects } from '@/components/layout/scroll-effects'
import { POSModal } from '@/components/pos'
import { ChatWidget } from '@/components/chat/chat-widget'


import { getSystemSettings } from '@/lib/actions/settings'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSystemSettings()
  const logoUrl = settings['site_logo_url']

  return (
    <div className="min-h-screen flex flex-col">
      {/* Effets visuels au scroll */}
      <ScrollEffects />

      <Header logoUrl={logoUrl} />
      {/* Spacer pour compenser le header fixed */}
      <div className="h-16 lg:h-20" aria-hidden="true" />
      <main className="flex-1">{children}</main>
      <Footer logoUrl={logoUrl} />
      {/* Modal POS global pour les ventes rapides */}
      <POSModal />

      <ChatWidget />

    </div>
  )
}
