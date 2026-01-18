// Section produits de la semaine
// Affiche les produits disponibles cette semaine (SSR)

'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Produit } from '@amap-togo/database'
import { ProductCard } from '@/components/produits/product-card'
import { useCartStore } from '@/stores/cart-store'

interface ProduitsSectionProps {
  produits: Produit[]
}

/**
 * Section des produits de la semaine
 * Recoit les produits pre-charges cote serveur
 */
export function ProduitsSection({ produits }: ProduitsSectionProps) {
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

  const sectionContent = (
    <section className="py-16 lg:py-24 bg-accent/20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground">
            Produits de la semaine
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Decouvrez notre selection de produits frais disponibles cette semaine.
          </p>
        </div>

        {produits.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {produits.slice(0, 8).map((produit) => (
              <ProductCard 
                key={produit.id} 
                produit={produit}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Aucun produit disponible pour le moment.
          </p>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/produits"
            className="
              inline-flex items-center gap-2
              px-6 py-3 rounded-lg
              bg-primary text-primary-foreground
              font-medium
              hover:bg-primary/90 transition-colors
            "
          >
            Voir tous les produits
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )

  return sectionContent
}
