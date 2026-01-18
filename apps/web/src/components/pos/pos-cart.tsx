// Section Panier du POS
// Liste des articles, quantites, total

'use client'

import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '@amap-togo/utils'
import { useCartStore } from '@/stores/cart-store'
import { POSCartItem } from './pos-cart-item'

/**
 * Section Panier du modal POS
 */
export function POSCart() {
  const { items, getTotalItems, getTotalPrice, setActiveSection } = useCartStore()
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  // Panier vide
  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Votre panier est vide
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Ajoutez des produits pour commencer votre commande
        </p>
        <button
          onClick={() => setActiveSection('produits')}
          className="
            px-4 py-2 bg-primary text-primary-foreground
            rounded-lg font-medium text-sm
            hover:bg-primary/90 transition-colors
          "
        >
          Voir les produits
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Titre */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-foreground">
          Panier ({totalItems} article{totalItems > 1 ? 's' : ''})
        </h3>
      </div>

      {/* Liste des articles */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item) => (
          <POSCartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Resume et bouton */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">
            {formatPrice(totalPrice)}
          </span>
        </div>
        <button
          onClick={() => setActiveSection('paiement')}
          className="
            lg:hidden
            w-full py-3 bg-primary text-primary-foreground
            rounded-lg font-medium
            hover:bg-primary/90 transition-colors
          "
        >
          Passer au paiement
        </button>
      </div>
    </div>
  )
}
