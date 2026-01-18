// Badge panier avec compteur
// Affiche le nombre d'articles dans le panier
// Ouvre le modal POS au clic

'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

interface CartButtonProps {
  onClick: () => void
  className?: string
}

/**
 * Badge panier avec compteur
 * Ouvre le modal POS au clic
 */
export function CartButton({ onClick, className = '' }: CartButtonProps) {
  const itemCount = useCartStore((state) => state.getTotalItems())

  return (
    <button
      onClick={onClick}
      className={`
        relative p-2 rounded-lg
        hover:bg-accent transition-colors duration-150
        ${className}
      `}
      aria-label={`Panier - ${itemCount} articles`}
    >
      <ShoppingCart className="w-5 h-5 text-foreground" strokeWidth={1.5} />
      
      {itemCount > 0 && (
        <span 
          className="
            absolute -top-1 -right-1 
            min-w-[18px] h-[18px] 
            bg-primary text-primary-foreground 
            text-xs font-medium 
            rounded-full 
            flex items-center justify-center
            px-1
          "
          aria-hidden="true"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
