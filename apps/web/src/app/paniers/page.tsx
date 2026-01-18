// Page des paniers AMAP hebdomadaires
// Affiche les 3 types de paniers de la semaine

import type { Metadata } from 'next'
import { createClientServer } from '@amap-togo/database/server'
import type { PanierSemaineComplet } from '@amap-togo/database'
import { PaniersListe } from '@/components/paniers/paniers-liste'
import { formatDateRange } from '@/lib/date-utils'

export const metadata: Metadata = {
  title: 'Paniers AMAP',
  description:
    'Decouvrez nos paniers AMAP hebdomadaires. ' +
    'Petit panier, grand panier ou panier 100% local.',
}

/**
 * Page des paniers AMAP de la semaine
 */
export default async function PaniersPage() {
  const { paniers, semaineDebut, semaineFin } = await getPaniersSemaine()

  return (
    <div className="container mx-auto px-6 lg:px-12 py-8 lg:py-12">
      {/* En-tete */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">
          Paniers AMAP
        </h1>
        <p className="mt-2 text-muted-foreground">
          Paniers composes cette semaine avec les meilleurs produits de saison.
        </p>
        {semaineDebut && semaineFin && (
          <p className="mt-4 text-sm font-medium text-primary">
            Semaine du {formatDateRange(semaineDebut, semaineFin)}
          </p>
        )}
      </div>

      {/* Liste des paniers */}
      <PaniersListe paniers={paniers} />

      {/* Informations livraison */}
      <div className="mt-12 p-6 bg-accent/30 rounded-xl">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Informations livraison
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Livraison le mercredi a partir de 11h30</li>
          <li>Point de retrait : Ancien Centre Mytro Nunya, Adidogome</li>
          <li>Livraison a domicile possible (frais selon quartier)</li>
        </ul>
      </div>
    </div>
  )
}

/** Recupere les paniers de la semaine en cours */
async function getPaniersSemaine() {
  try {
    const supabase = await createClientServer()

    // Date du jour
    const today = new Date().toISOString().split('T')[0]

    // Recupere les paniers de la semaine avec leur contenu
    const { data } = await supabase
      .from('paniers_semaine')
      .select(`
        *,
        panier_type:paniers_types(*),
        contenu:paniers_contenu(
          *,
          produit:produits(id, nom, unite)
        )
      `)
      .eq('actif', true)
      .lte('semaine_debut', today)
      .gte('semaine_fin', today)
      .order('panier_type_id')

    // Type assertion pour les donnees retournees
    type PanierData = {
      semaine_debut: string
      semaine_fin: string
    }

    if (!data || data.length === 0) {
      return { paniers: [], semaineDebut: null, semaineFin: null }
    }

    const paniers = data as unknown as PanierData[]
    return {
      paniers: data as PanierSemaineComplet[],
      semaineDebut: paniers[0].semaine_debut,
      semaineFin: paniers[0].semaine_fin,
    }
  } catch {
    return { paniers: [], semaineDebut: null, semaineFin: null }
  }
}
