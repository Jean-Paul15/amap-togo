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
    <div className="bg-background border border-border rounded-xl overflow-hidden">
      {/* En-tete */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {typePanier.nom}
            </h3>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(typePanier.prix)}
            </p>
          </div>
        </div>

        {typePanier.description && (
          <p className="text-sm text-muted-foreground">
            {typePanier.description}
          </p>
        )}
      </div>

      {/* Contenu du panier */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Contenu de la semaine
        </h4>
        <BasketContent contenu={panier.contenu} />
      </div>

      {/* Bouton commander */}
      <div className="px-6 pb-6">
        <button
          onClick={() => onCommander(panier)}
          className="
            w-full py-3 px-4 rounded-lg
            bg-primary text-primary-foreground
            font-medium
            hover:bg-primary/90 transition-colors
          "
        >
          Commander ce panier
        </button>
      </div>
    </div>
  )
}
