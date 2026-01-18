// Carte d'un panier AMAP
// Affiche type, prix, contenu et bouton commander

'use client'

import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '@amap-togo/utils'
import { BasketContent } from './basket-content'
import type { PanierSemaineComplet } from '@amap-togo/database'

interface BasketCardProps {
  panier: PanierSemaineComplet
  onCommander: (panier: PanierSemaineComplet) => void
}

/**
 * Carte d'un panier AMAP avec contenu et bouton commander
 */
export function BasketCard({ panier, onCommander }: BasketCardProps) {
  const typePanier = panier.panier_type

  return (
    <div className="bg-background border border-border rounded-xl overflow-hidden h-full flex flex-col">
      {/* En-tete compact */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-4 h-4 text-primary" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {typePanier.nom}
            </h3>
            <p className="text-lg font-bold text-primary">
              {formatPrice(typePanier.prix)}
            </p>
          </div>
        </div>

        {typePanier.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {typePanier.description}
          </p>
        )}
      </div>

      {/* Contenu du panier */}
      <div className="p-3 flex-1">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
          Contenu de la semaine
        </h4>
        <BasketContent contenu={panier.contenu} />
      </div>

      {/* Bouton POS */}
      <div className="px-3 pb-3">
        <button
          onClick={() => onCommander(panier)}
          className="
            w-full py-2 px-3 rounded-lg
            bg-primary text-primary-foreground
            font-medium text-sm
            hover:bg-primary/90 transition-colors
          "
        >
          Ajouter au POS
        </button>
      </div>
    </div>
  )
}
