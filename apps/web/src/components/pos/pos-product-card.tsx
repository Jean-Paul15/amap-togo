// Carte produit compacte pour le POS mobile
// Affichage horizontal optimise pour petit ecran

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Check, Package } from 'lucide-react'
import { formatPrice } from '@amap-togo/utils'
import type { Produit } from '@amap-togo/database'

interface POSProductCardProps {
  produit: Produit
  onAddToCart: (produit: Produit) => void
}

/**
 * Carte produit compacte horizontale pour le POS
 * Optimisee pour les petits ecrans
 */
export function POSProductCard({ produit, onAddToCart }: POSProductCardProps) {
  const [justAdded, setJustAdded] = useState(false)

  const handleAdd = () => {
    if (justAdded || produit.stock === 0) return
    
    onAddToCart(produit)
    setJustAdded(true)
    
    setTimeout(() => setJustAdded(false), 1500)
  }

  const isOutOfStock = produit.stock === 0

  return (
    <div className="flex items-center gap-3 p-2.5 bg-background border border-border rounded-lg hover:border-primary/30 transition-colors">
      {/* Image compacte */}
      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-accent/20">
        {produit.image_url ? (
          <Image
            src={produit.image_url}
            alt={produit.nom}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-5 h-5 text-muted-foreground/40" />
          </div>
        )}
        
        {/* Badge rupture */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-[9px] font-bold text-white uppercase">
              Rupture
            </span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">
          {produit.nom}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-bold text-primary">
            {formatPrice(produit.prix)}
          </span>
          <span className="text-xs text-muted-foreground">
            /{produit.unite}
          </span>
        </div>
      </div>

      {/* Bouton ajouter */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={isOutOfStock || justAdded}
        className={`
          flex-shrink-0 w-10 h-10 rounded-lg
          flex items-center justify-center
          transition-all duration-200
          ${justAdded
            ? 'bg-green-500 text-white'
            : isOutOfStock
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
          }
        `}
        aria-label={`Ajouter ${produit.nom}`}
      >
        {justAdded ? (
          <Check className="w-5 h-5" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}
