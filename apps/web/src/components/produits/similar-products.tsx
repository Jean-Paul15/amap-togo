// Grille de produits similaires avec panier
// Composant client pour permettre l'ajout au panier

'use client'

import type { Produit } from '@amap-togo/database'
import { ProductCard } from './product-card'
import { useCartStore } from '@/stores/cart-store'

interface SimilarProductsProps {
  produits: Produit[]
}

/**
 * Affiche les produits similaires avec possibilite d'ajouter au panier
 */
export function SimilarProducts({ produits }: SimilarProductsProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (produit: Produit) => {
    addItem({
      id: produit.id,
      type: 'produit',
      nom: produit.nom,
      prix: produit.prix,
      unite: produit.unite,
      imageUrl: produit.image_url || undefined,
    })
  }

  if (produits.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Produits similaires
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {produits.map((produit) => (
          <ProductCard
            key={produit.id}
            produit={produit}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  )
}
