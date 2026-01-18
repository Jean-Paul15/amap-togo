// Provider qui hydrate le store avec les donnees SSR
// Les produits sont charges cote serveur et passes ici

'use client'

import { useRef } from 'react'
import { useProductsStore } from '@/stores/products-store'
import type { Produit, Categorie } from '@amap-togo/database'

interface ProductsProviderProps {
  children: React.ReactNode
  initialProducts?: Produit[]
  initialCategories?: Categorie[]
}

/**
 * Provider qui hydrate le store Zustand avec les donnees SSR
 * Hydratation synchrone pour affichage instantane
 */
export function ProductsProvider({
  children,
  initialProducts,
  initialCategories,
}: ProductsProviderProps) {
  const hasHydrated = useRef(false)

  // Hydratation synchrone (avant le premier rendu)
  if (!hasHydrated.current && initialProducts && initialCategories) {
    hasHydrated.current = true
    // Hydrater le store directement (synchrone)
    useProductsStore.setState({
      produits: initialProducts,
      categories: initialCategories,
      isLoaded: true,
    })
  }

  return <>{children}</>
}
