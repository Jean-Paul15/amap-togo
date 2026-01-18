// Store Zustand pour les produits POS
// Cache avec revalidation en arriere-plan

import { create } from 'zustand'
import type { Produit, Categorie } from '@amap-togo/database'

/** Etat du store produits */
interface ProductsState {
  produits: Produit[]
  categories: Categorie[]
  isLoaded: boolean
  lastFetchedAt: number | null
  setProducts: (produits: Produit[], categories: Categorie[]) => void
  clearProducts: () => void
  revalidate: () => Promise<void>
}

// Duree de validite du cache : 2 minutes
const CACHE_DURATION_MS = 2 * 60 * 1000

/**
 * Store produits avec cache et revalidation
 * Affiche instantanement le cache, rafraichit en arriere-plan si necessaire
 */
export const useProductsStore = create<ProductsState>((set, get) => ({
  produits: [],
  categories: [],
  isLoaded: false,
  lastFetchedAt: null,

  setProducts: (produits, categories) => {
    set({ 
      produits, 
      categories, 
      isLoaded: true,
      lastFetchedAt: Date.now(),
    })
  },

  clearProducts: () => {
    set({ produits: [], categories: [], isLoaded: false, lastFetchedAt: null })
  },

  // Revalidation silencieuse en arriere-plan
  revalidate: async () => {
    const { lastFetchedAt } = get()
    
    // Ne pas revalider si le cache est encore frais
    if (lastFetchedAt && Date.now() - lastFetchedAt < CACHE_DURATION_MS) {
      return
    }

    try {
      const { createClientBrowser } = await import('@amap-togo/database/browser')
      const supabase = createClientBrowser()

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
        set({
          produits: produitsResult.data,
          categories: categoriesResult.data,
          lastFetchedAt: Date.now(),
        })
      }
    } catch (err) {
      console.error('Erreur revalidation produits:', err)
    }
  },
}))
