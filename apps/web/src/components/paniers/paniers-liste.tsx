// Liste des paniers AMAP avec actions
// Composant client pour gerer les ajouts au panier

'use client'

import type { PanierSemaineComplet } from '@amap-togo/database'
import { BasketCard } from './basket-card'
import { useCartStore } from '@/stores/cart-store'

interface PaniersListeProps {
  paniers: PanierSemaineComplet[]
}

/**
 * Liste des paniers AMAP de la semaine
 */
export function PaniersListe({ paniers }: PaniersListeProps) {
  const addPanier = useCartStore((state) => state.addPanier)

  const handleCommander = (panier: PanierSemaineComplet) => {
    addPanier({
      id: panier.id,
      nom: panier.panier_type.nom,
      prix: panier.panier_type.prix,
    })
  }

  if (paniers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Aucun panier disponible cette semaine.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Revenez bientot pour decouvrir nos paniers !
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paniers.map((panier) => (
        <BasketCard
          key={panier.id}
          panier={panier}
          onCommander={handleCommander}
        />
      ))}
    </div>
  )
}
