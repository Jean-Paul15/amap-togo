// Bouton POS dans le header
// Ouvre le modal POS

'use client'

import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

/**
 * Bouton POS qui ouvre le modal
 */
export function POSTrigger() {
  const openModal = useCartStore((state) => state.openModal)

  return (
    <button
      onClick={openModal}
      className="
        flex items-center gap-2 px-4 py-2
        bg-primary text-primary-foreground
        rounded-lg font-medium text-sm
        hover:bg-primary/90 transition-colors
      "
    >
      <ShoppingBag className="w-4 h-4" strokeWidth={2} />
      <span className="hidden sm:inline">POS</span>
    </button>
  )
}
