// Bouton POS dans le header
// Ouvre le modal POS

'use client'

import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

/**
 * Bouton POS qui ouvre le modal
 * Adapte pour mobile avec icone seule
 */
export function POSTrigger() {
  const openModal = useCartStore((state) => state.openModal)

  return (
    <button
      onClick={openModal}
      className="
        flex items-center justify-center gap-2 
        px-3 sm:px-4 py-2
        bg-primary text-primary-foreground
        rounded-lg font-medium text-sm
        hover:bg-primary/90 transition-colors
        min-w-[40px] sm:min-w-0
      "
      aria-label="Ouvrir le point de vente"
    >
      <ShoppingBag className="w-4 h-4" strokeWidth={2} />
      <span className="hidden sm:inline">Commander</span>
    </button>
  )
}
