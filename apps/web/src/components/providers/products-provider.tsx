// Provider qui pre-charge les produits au montage
// Evite les chargements repetitifs dans le POS

'use client'

import { useEffect } from 'react'
import { createClientBrowser } from '@amap-togo/database/browser'
import { useProductsStore } from '@/stores/products-store'

/**
 * Provider qui charge les produits une seule fois au montage
 * Les produits sont ensuite disponibles instantanement dans le POS
 */
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, setProducts } = useProductsStore()

  useEffect(() => {
    // Ne charger qu'une fois
    if (isLoaded) return

    const supabase = createClientBrowser()

    async function loadProducts() {
      try {
        const [produitsResult, categoriesResult] = await Promise.all([
          supabase
            .from('produits')
            .select('*')
            .eq('actif', true)
            .gt('stock', 0)
            .order('nom'),
          supabase
            .from('categories')
            .select('*')
            .eq('actif', true)
            .order('ordre'),
        ])

        if (produitsResult.data && categoriesResult.data) {
          setProducts(produitsResult.data, categoriesResult.data)
        }
      } catch (err) {
        console.error('Erreur chargement produits:', err)
      }
    }

    loadProducts()
  }, [isLoaded, setProducts])

  return <>{children}</>
}
