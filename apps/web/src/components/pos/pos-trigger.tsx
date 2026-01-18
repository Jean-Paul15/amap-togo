// Bouton POS minimaliste
// Ouvre le modal POS avec animations subtiles

'use client'

import { ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/stores/cart-store'

/**
 * Bouton POS minimaliste et discret
 */
export function POSTrigger() {
  const openModal = useCartStore((state) => state.openModal)

  return (
    <motion.button
      onClick={openModal}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="
        relative
        flex items-center justify-center gap-1.5
        px-3 py-2
        text-primary hover:text-primary/80
        bg-primary/5 hover:bg-primary/10
        rounded-lg
        font-medium text-sm
        transition-colors duration-200
        border border-primary/10
      "
      aria-label="Ouvrir le point de vente"
      title="Point de vente"
    >
      <ShoppingBag className="w-4 h-4" strokeWidth={2} />
      <span className="hidden sm:inline text-xs">POS</span>
    </motion.button>
  )
}
