// Modal POS principal
// 3 sections : Produits, Panier, Paiement

'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { POSNavigation } from './pos-navigation'
import { POSProducts } from './pos-products'
import { POSCart } from './pos-cart'
import { POSCheckout } from './pos-checkout'

/**
 * Modal POS avec 3 sections
 * Desktop : 3 colonnes cote a cote
 * Mobile : onglets avec une seule section visible
 */
export function POSModal() {
  const { isModalOpen, closeModal, activeSection } = useCartStore()

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isModalOpen, closeModal])

  // Bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  if (!isModalOpen) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="
          fixed inset-2 z-50
          sm:inset-4 md:inset-8 lg:inset-12
          bg-background rounded-xl shadow-2xl
          flex flex-col overflow-hidden
        "
      >
        {/* Header du modal */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Point de Vente
          </h2>
          <button
            onClick={closeModal}
            className="p-1.5 sm:p-2 bg-muted hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Navigation mobile */}
        <div className="lg:hidden border-b border-border">
          <POSNavigation />
        </div>

        {/* Contenu */}
        <div className="flex-1 flex min-h-0">
          {/* Desktop : 3 colonnes */}
          <div className="hidden lg:flex w-full">
            <div className="w-[40%] border-r border-border flex flex-col min-h-0">
              <POSProducts />
            </div>
            <div className="w-[30%] border-r border-border flex flex-col min-h-0">
              <POSCart />
            </div>
            <div className="w-[30%] flex flex-col min-h-0">
              <POSCheckout />
            </div>
          </div>

          {/* Mobile : une section a la fois */}
          <div className="lg:hidden flex-1 flex flex-col min-h-0">
            {activeSection === 'produits' && <POSProducts />}
            {activeSection === 'panier' && <POSCart />}
            {activeSection === 'paiement' && <POSCheckout />}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
