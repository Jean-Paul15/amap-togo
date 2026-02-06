// Page d'accueil AMAP TOGO
// Server Component avec donnees pre-chargees

import type { Metadata } from 'next'
import {
  HeroSection,
  ProduitsSection,
  PaniersSection,
  ValuesSection
} from '@/components/home'
import { ListeProduitsSemaine } from '@/components/home/liste-produits-semaine'
import { createClientServer } from '@amap-togo/database/server'
import { PageViewTracker } from '@/components/analytics/page-view-tracker'

export const metadata: Metadata = {
  title: 'AMAP TOGO - Produits Bio et Locaux au Togo',
  description: 'AMAP TOGO : produits agricoles bio et locaux au Togo. Paniers hebdomadaires, livraison à Lomé. Tomates, légumes frais, fruits de saison. Biologique sans pesticides. Rejoignez notre communauté solidaire.',
  keywords: [
    'AMAP TOGO',
    'produits bio',
    'agriculture biologique',
    'Togo',
    'Lomé',
    'produits locaux',
    'panier hebdomadaire',
    'légumes bio',
    'fruits frais',
    'commerce équitable',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fermagroecologie.org',
  },
}

/**
 * Page d'accueil avec sections :
 * - Hero (message + CTA)
 * - Produits de la semaine (SSR)
 * - Paniers AMAP
 * - Valeurs (bio, local, solidaire)
 */
import { getSystemSettings } from '@/lib/actions/settings'

export default async function HomePage() {
  // Recupere les produits, paniers et settings
  const [produits, paniers, settings] = await Promise.all([
    getProduitsSemaine(),
    getPaniersSemaine(),
    getSystemSettings()
  ])

  return (
    <>
      <HeroSection
        imageUrl={settings['site_hero_url']}
        bgColor={settings['site_bg_color'] || '#0a1f12'}
        bgImageUrl={settings['site_bg_image_url']}
        bgVideoUrl={settings['site_bg_video_url']}
      />
      <ProduitsSection produits={produits} />
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          <ListeProduitsSemaine />
        </div>
      </section>
      <PaniersSection paniers={paniers} />
      <ValuesSection />
      <PageViewTracker />
    </>
  )
}

/** Recupere les produits disponibles cette semaine */
async function getProduitsSemaine() {
  try {
    const supabase = await createClientServer()

    const { data, error } = await supabase
      .from('produits')
      .select('*')
      .eq('actif', true)
      .eq('en_vedette', true)
      .order('ordre', { ascending: true })
      .limit(8)

    if (error) {
      console.error('Erreur chargement produits:', error)
      return []
    }

    return data || []
  } catch {
    // En cas d'erreur (Supabase non configure), retourne tableau vide
    return []
  }
}

/** Recupere les types de paniers actifs */
async function getPaniersSemaine() {
  try {
    const supabase = await createClientServer()

    const { data, error } = await supabase
      .from('paniers_types')
      .select('*')
      .eq('actif', true)
      .order('prix', { ascending: true })

    if (error) {
      console.error('Erreur chargement paniers:', error)
      return []
    }

    return data || []
  } catch {
    // En cas d'erreur, retourne tableau vide
    return []
  }
}