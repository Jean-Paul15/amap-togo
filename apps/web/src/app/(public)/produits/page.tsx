// Page catalogue des produits
// Affiche tous les produits avec filtres et recherche

import type { Metadata } from 'next'
import { ProductCatalog } from '@/components/produits/product-catalog'
import { createClientServer } from '@amap-togo/database/server'

export const metadata: Metadata = {
  title: 'Nos Produits | AMAP TOGO',
  description: 
    'Découvrez notre sélection de produits bio et locaux. ' +
    'Légumes, fruits, céréales et produits transformés du Togo. 100% biologique, commerce équitable.',
  keywords: [
    'produits bio',
    'légumes frais',
    'fruits',
    'Togo',
    'Lomé',
    'commerce équitable',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fermagroecologie.org') + '/produits',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_TG',
    url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fermagroecologie.org') + '/produits',
    siteName: 'AMAP TOGO',
    title: 'Nos Produits Bio et Locaux | AMAP TOGO',
    description: 'Découvrez notre sélection de produits bio et locaux au Togo.',
  },
}

/**
 * Page catalogue des produits avec filtres SSR
 */
export default async function ProduitsPage() {
  const { produits, categories } = await getProduitsData()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12">
      {/* En-tete */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
          Nos produits
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Produits bio et locaux, du producteur à votre table.
        </p>
      </div>

      {/* Catalogue avec filtres */}
      <ProductCatalog produits={produits} categories={categories} />
    </div>
  )
}

/** Recupere les produits et categories */
async function getProduitsData() {
  try {
    const supabase = await createClientServer()

    // Requetes paralleles
    const [produitsResult, categoriesResult] = await Promise.all([
      supabase
        .from('produits')
        .select('*')
        .eq('actif', true)
        .order('ordre', { ascending: true }),
      supabase
        .from('categories')
        .select('*')
        .eq('actif', true)
        .order('ordre', { ascending: true }),
    ])

    return {
      produits: produitsResult.data || [],
      categories: categoriesResult.data || [],
    }
  } catch {
    return { produits: [], categories: [] }
  }
}
