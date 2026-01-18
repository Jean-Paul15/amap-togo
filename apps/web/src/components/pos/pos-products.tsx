// Section Produits du POS
// Recherche, categories, grille de produits

'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import type { Produit } from '@amap-togo/database'
import { ProductCard } from '@/components/produits/product-card'
import { POSCategoryFilter } from './pos-category-filter'
import { useCartStore } from '@/stores/cart-store'
import { useProductsStore } from '@/stores/products-store'

/**
 * Section Produits du modal POS
 * Utilise le store pre-charge pour affichage instantane
 */
export function POSProducts() {
  const { produits, categories, isLoaded } = useProductsStore()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const addItem = useCartStore((state) => state.addItem)

  // Filtrer les produits
  const filteredProducts = produits.filter((p) => {
    const matchCategory = !selectedCategory || p.categorie_id === selectedCategory
    const matchSearch = !searchQuery || 
      p.nom.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

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

  return (
    <div className="h-full flex flex-col">
      {/* Titre */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-foreground">
          Produits
        </h3>
      </div>

      {/* Recherche */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="
              w-full pl-10 pr-4 py-2
              bg-muted border border-border rounded-lg
              text-sm placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/20
            "
          />
        </div>
      </div>

      {/* Categories */}
      <div className="border-b">
        <POSCategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Grille produits */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {!isLoaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucun produit trouvé
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filteredProducts.map((produit) => (
              <ProductCard
                key={produit.id}
                produit={produit}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
