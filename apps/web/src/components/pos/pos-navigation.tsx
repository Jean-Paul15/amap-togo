// Navigation entre les sections du POS
// Onglets pour mobile

'use client'

import { Package, ShoppingCart, CreditCard } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

const sections = [
  { id: 'produits', label: 'Produits', icon: Package },
  { id: 'panier', label: 'Panier', icon: ShoppingCart },
  { id: 'paiement', label: 'Paiement', icon: CreditCard },
] as const

/**
 * Navigation entre les 3 sections du POS (mobile)
 */
export function POSNavigation() {
  const { activeSection, setActiveSection, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <nav className="flex">
      {sections.map((section) => {
        const Icon = section.icon
        const isActive = activeSection === section.id
        const showBadge = section.id === 'panier' && totalItems > 0

        return (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4
              text-sm font-medium transition-colors relative
              ${isActive
                ? 'text-primary border-b-2 border-primary bg-accent/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{section.label}</span>

            {/* Badge nombre articles */}
            {showBadge && (
              <span className="
                absolute top-2 right-2
                min-w-[18px] h-[18px] px-1
                bg-primary text-primary-foreground
                text-xs font-medium rounded-full
                flex items-center justify-center
              ">
                {totalItems}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
