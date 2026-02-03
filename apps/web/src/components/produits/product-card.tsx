// Carte produit pour le catalogue
// Affiche image, nom, prix et bouton ajouter

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import { formatPrice } from '@amap-togo/utils'
import type { Produit } from '@amap-togo/database'

export interface ProductCardProps {
  produit: Produit
  onAddToCart?: (produit: Produit) => void
  variant?: 'default' | 'glass'
}

/**
 * Carte produit moderne avec animation d'ajout
 */
export function ProductCard({ produit, onAddToCart, variant = 'default' }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!onAddToCart || isAdding || justAdded) return

    setIsAdding(true)
    onAddToCart(produit)

    // Animation de confirmation
    setTimeout(() => {
      setIsAdding(false)
      setJustAdded(true)

      // Retour a l'etat normal
      setTimeout(() => {
        setJustAdded(false)
      }, 2000)
    }, 300)
  }

  const isDisabled = produit.stock === 0 || !onAddToCart
  const isGlass = variant === 'glass'

  return (
    <div className={`group relative rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-lg flex flex-col
      ${isGlass
        ? 'bg-white/5 border-white/10 hover:border-green-400/50 hover:shadow-green-900/20 text-white'
        : 'bg-background border-border hover:border-primary/30'
      }
    `}>
      {/* Image sans lien */}
      <div className="block">
        <div className={`aspect-square relative overflow-hidden
           ${isGlass ? 'bg-white/5' : 'bg-gradient-to-br from-accent/30 to-accent/10'}
        `}>
          {produit.image_url ? (
            <Image
              src={produit.image_url}
              alt={produit.nom}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isGlass ? 'bg-white/5' : 'bg-accent/30'}`}>
              <span className={`text-5xl font-semibold ${isGlass ? 'text-white/20' : 'text-muted-foreground/40'}`}>
                {produit.nom.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Overlay gradient au hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
            {produit.stock <= produit.seuil_alerte && produit.stock > 0 && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-orange-500 text-white text-[10px] sm:text-xs font-medium rounded-full shadow-sm">
                Stock faible
              </span>
            )}
            {produit.stock === 0 && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-red-500 text-white text-[10px] sm:text-xs font-medium rounded-full shadow-sm">
                Rupture
              </span>
            )}
          </div>

          {/* Prix badge */}
          <div className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md backdrop-blur-sm
             ${isGlass ? 'bg-black/60 text-white' : 'bg-white/95 text-primary'}
          `}>
            <span className={`text-xs sm:text-sm font-bold ${isGlass ? 'text-green-400' : 'text-primary'}`}>
              {formatPrice(produit.prix)}
            </span>
            <span className={`text-[10px] sm:text-xs ml-0.5 sm:ml-1 ${isGlass ? 'text-gray-300' : 'text-muted-foreground'}`}>
              /{produit.unite}
            </span>
          </div>
        </div>
      </div>

      {/* Infos - flex-1 pour pousser le bouton en bas */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        {/* Contenu texte */}
        <div className="flex-1">
          <h3 className={`text-sm sm:text-base font-semibold line-clamp-2 transition-colors
             ${isGlass ? 'text-gray-100 group-hover:text-green-400' : 'text-foreground group-hover:text-primary'}
          `}>
            {produit.nom}
          </h3>

          {/* Stock disponible */}
          {produit.stock > 0 && (
            <p className={`text-[10px] sm:text-xs mt-1 sm:mt-1.5 ${isGlass ? 'text-gray-400' : 'text-muted-foreground'}`}>
              {produit.stock} {produit.unite}{produit.stock > 1 ? 's' : ''} disponible{produit.stock > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Bouton ajouter - toujours en bas */}
        {onAddToCart && (
          <button
            type="button"
            onClick={handleAddClick}
            disabled={isDisabled || isAdding || justAdded}
            className={`
              mt-2 sm:mt-2.5 w-full flex items-center justify-center gap-1.5 sm:gap-2
              py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg
              text-xs sm:text-sm font-medium
              whitespace-nowrap
              transition-all duration-300
              ${justAdded
                ? 'bg-green-500 text-white'
                : isDisabled
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : isGlass
                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:scale-95'
              }
            `}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>Ajouté</span>
              </>
            ) : isAdding ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isDisabled ? (
              <span>Rupture</span>
            ) : (
              <>
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span>Ajouter</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
