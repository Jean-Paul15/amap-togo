// Store Zustand pour les produits POS
// Cache les produits pour eviter les chargements repetitifs

import { create } from 'zustand'
import type { Produit, Categorie } from '@amap-togo/database'

/** Etat du store produits */
interface ProductsState {
  produits: Produit[]
  categories: Categorie[]
  isLoaded: boolean
  setProducts: (produits: Produit[], categories: Categorie[]) => void
  clearProducts: () => void
}

/**
 * Store produits avec cache
 * Les produits sont charges une fois au montage de l'app
 */
export const useProductsStore = create<ProductsState>((set) => ({
  produits: [],
  categories: [],
  isLoaded: false,

  setProducts: (produits, categories) => {
    set({ produits, categories, isLoaded: true })
  },

  clearProducts: () => {
    set({ produits: [], categories: [], isLoaded: false })
  },
}))
