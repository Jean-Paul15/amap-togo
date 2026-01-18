// Bouton POS pour ouvrir le modal de vente
// Affiche icone ShoppingBag + texte "POS"

'use client'

import { ShoppingBag } from 'lucide-react'

interface PosButtonProps {
  onClick: () => void
  className?: string
}

/**
 * Bouton POS pour ouvrir le modal de point de vente
 */
export function PosButton({ onClick, className = '' }: PosButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        bg-primary text-primary-foreground
        text-sm font-medium
        hover:bg-primary/90 transition-colors duration-150
        ${className}
      `}
      aria-label="Ouvrir le point de vente"
    >
      <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
      <span className="hidden sm:inline">POS</span>
    </button>
  )
}
