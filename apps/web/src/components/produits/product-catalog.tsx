// Composant client pour le catalogue produits
// Gere les filtres et la recherche cote client

'use client'

import { useState, useMemo } from 'react'
import type { Produit, Categorie } from '@amap-togo/database'
import { ProductGrid } from './product-grid'
import { CategoryFilter } from './category-filter'
import { SearchBar } from './search-bar'
import { useCartStore } from '@/stores/cart-store'

interface ProductCatalogProps {
  produits: Produit[]
  categories: Categorie[]
}

/**
 * Catalogue produits avec filtres et recherche
 */
export function ProductCatalog({ produits, categories }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  // Filtrage des produits
  const filteredProduits = useMemo(() => {
    return produits.filter((produit) => {
      // Filtre par categorie
      if (selectedCategory && produit.categorie_id !== selectedCategory) {
        return false
      }

      // Filtre par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return produit.nom.toLowerCase().includes(query)
      }

      return true
    })
  }, [produits, selectedCategory, searchQuery])

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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar filtres - Desktop */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24">
          <CategoryFilter
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1">
        {/* Barre de recherche et filtres mobile */}
        <div className="mb-6 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Filtres mobile */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`
                shrink-0 px-4 py-2 rounded-full text-sm font-medium
                transition-colors duration-150
                ${selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
                }
              `}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  shrink-0 px-4 py-2 rounded-full text-sm font-medium
                  transition-colors duration-150
                  ${selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }
                `}
              >
                {cat.nom}
              </button>
            ))}
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredProduits.length} produit{filteredProduits.length > 1 ? 's' : ''} trouvé{filteredProduits.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille produits */}
        <ProductGrid produits={filteredProduits} onAddToCart={handleAddToCart} />
      </div>
    </div>
  )
}
