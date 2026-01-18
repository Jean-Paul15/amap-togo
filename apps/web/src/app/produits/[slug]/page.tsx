// Page de detail d'un produit
// Affiche image, description, prix, stock et produits similaires

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClientServer } from '@amap-togo/database/server'
import type { Produit } from '@amap-togo/database'
import { ProductDetail } from '@/components/produits/product-detail'
import { SimilarProducts } from '@/components/produits/similar-products'

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Genere les metadata SEO dynamiques
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const produit = await getProduitBySlug(slug)

  if (!produit) {
    return { title: 'Produit non trouve' }
  }

  return {
    title: produit.nom,
    description: produit.description || `${produit.nom} - Produit bio et local AMAP TOGO`,
    openGraph: {
      title: produit.nom,
      description: produit.description || `${produit.nom} - Produit bio et local`,
      images: produit.image_url ? [produit.image_url] : [],
    },
  }
}

/**
 * Pre-genere les pages pour les produits actifs
 */
export async function generateStaticParams() {
  try {
    const supabase = await createClientServer()
    const { data } = await supabase
      .from('produits')
      .select('slug')
      .eq('actif', true)

    type SlugData = { slug: string }
    const produits = (data || []) as SlugData[]
    return produits.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

/**
 * Page detail produit
 */
export default async function ProduitPage({ params }: PageProps) {
  const { slug } = await params
  const produit = await getProduitBySlug(slug)

  if (!produit) {
    notFound()
  }

  const similaires = await getProduitsSimilaires(produit.categorie_id, produit.id)

  return (
    <div className="container mx-auto px-6 lg:px-12 py-8 lg:py-12">
      {/* Detail produit */}
      <ProductDetail produit={produit} />

      {/* Produits similaires */}
      <SimilarProducts produits={similaires} />
    </div>
  )
}

/** Recupere un produit par son slug */
async function getProduitBySlug(slug: string): Promise<Produit | null> {
  try {
    const supabase = await createClientServer()
    const { data } = await supabase
      .from('produits')
      .select('*')
      .eq('slug', slug)
      .eq('actif', true)
      .single()

    return data as Produit | null
  } catch {
    return null
  }
}

/** Recupere les produits de la meme categorie */
async function getProduitsSimilaires(
  categorieId: string,
  excludeId: string
): Promise<Produit[]> {
  try {
    const supabase = await createClientServer()
    const { data } = await supabase
      .from('produits')
      .select('*')
      .eq('categorie_id', categorieId)
      .eq('actif', true)
      .neq('id', excludeId)
      .limit(4)

    return (data || []) as Produit[]
  } catch {
    return []
  }
}
