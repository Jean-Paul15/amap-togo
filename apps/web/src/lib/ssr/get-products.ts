// Chargement SSR des produits et categories
// Execute cote serveur pour avoir les donnees au premier rendu

import { createClientServer } from '@amap-togo/database/server'
import type { Produit, Categorie } from '@amap-togo/database'

export interface ProductsData {
  produits: Produit[]
  categories: Categorie[]
}

/**
 * Charge les produits et categories cote serveur
 * Appele dans le layout pour SSR
 */
export async function getProductsData(): Promise<ProductsData> {
  try {
    const supabase = await createClientServer()

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

    return {
      produits: produitsResult.data || [],
      categories: categoriesResult.data || [],
    }
  } catch (err) {
    console.error('Erreur SSR produits:', err)
    return { produits: [], categories: [] }
  }
}
