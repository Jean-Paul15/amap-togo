// Grille de produits responsive
// Affiche les produits en grille adaptative

import type { Produit } from '@amap-togo/database'
import { ProductCard } from './product-card'

interface ProductGridProps {
  produits: Produit[]
  onAddToCart?: (produit: Produit) => void
}

/**
 * Grille responsive de cartes produits
 * 2 colonnes mobile, 3 tablette, 4 desktop
 */
export function ProductGrid({ produits, onAddToCart }: ProductGridProps) {
  if (produits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Aucun produit trouve.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {produits.map((produit) => (
        <ProductCard
          key={produit.id}
          produit={produit}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
