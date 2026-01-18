// Badge panier dans le header
// Affiche le nombre d'articles

'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

/**
 * Icone panier avec badge nombre d'articles
 */
export function CartBadge() {
  const { openModal, getTotalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)
  
  // Eviter l'erreur d'hydratation (localStorage)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const totalItems = mounted ? getTotalItems() : 0

  return (
    <button
      onClick={openModal}
      className="relative p-2 hover:bg-muted rounded-lg transition-colors"
      aria-label={`Panier (${totalItems} articles)`}
    >
      <ShoppingCart className="w-5 h-5 text-foreground" strokeWidth={1.5} />

      {totalItems > 0 && (
        <span className="
          absolute -top-1 -right-1
          min-w-[18px] h-[18px] px-1
          bg-red-500 text-white
          text-xs font-medium rounded-full
          flex items-center justify-center
        ">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
