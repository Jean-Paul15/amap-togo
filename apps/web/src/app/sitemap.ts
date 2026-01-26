/* Sitemap dynamique pour SEO */

import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amaptogo.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    /* Récupérer les produits et catégories */
    const [{ data: produits }, { data: categories }] = await Promise.all([
      supabase.from('produits').select('id, slug, updated_at'),
      supabase.from('categories').select('id, slug, updated_at'),
    ])

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/catalogue`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/paniers`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/apropos`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
    ]

    /* Ajouter les produits */
    const produitsMap: MetadataRoute.Sitemap = (produits || []).map((p: { updated_at?: string; slug: string }) => ({
      url: `${baseUrl}/produit/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    /* Ajouter les catégories */
    const categoriesMap: MetadataRoute.Sitemap = (categories || []).map((c: { updated_at?: string; slug: string }) => ({
      url: `${baseUrl}/categorie/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

    return [...staticPages, ...categoriesMap, ...produitsMap]
  } catch (error) {
    console.error('Erreur génération sitemap:', error)
    /* Retourner au moins les pages statiques */
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/catalogue`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ]
  }
}
