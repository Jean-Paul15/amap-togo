// Page d'accueil AMAP TOGO
// Server Component avec donnees pre-chargees

import type { Metadata } from 'next'
import { 
  HeroSection, 
  ProduitsSection, 
  PaniersSection, 
  ValuesSection 
} from '@/components/home'
import { createClientServer } from '@amap-togo/database/server'

export const metadata: Metadata = {
  title: 'AMAP TOGO - Produits Bio et Locaux',
  description: 'Association pour le Maintien d\'une Agriculture Paysanne au Togo. Produits bio et locaux livrés à Lomé. Paniers hebdomadaires.',
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * Page d'accueil avec sections :
 * - Hero (message + CTA)
 * - Produits de la semaine (SSR)
 * - Paniers AMAP
 * - Valeurs (bio, local, solidaire)
 */
export default async function HomePage() {
  // Recupere les produits et paniers de la semaine
  const [produits, paniers] = await Promise.all([
    getProduitsSemaine(),
    getPaniersSemaine(),
  ])

  return (
    <>
      <HeroSection />
      <ProduitsSection produits={produits} />
      <PaniersSection paniers={paniers} />
      <ValuesSection />
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
      .eq('disponible_semaine', true)
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