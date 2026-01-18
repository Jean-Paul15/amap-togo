// Carte produit pour le catalogue
// Affiche image, nom, prix et bouton ajouter

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import { formatPrice } from '@amap-togo/utils'
import type { Produit } from '@amap-togo/database'

interface ProductCardProps {
  produit: Produit
  onAddToCart?: (produit: Produit) => void
}

/**
 * Carte produit moderne avec animation d'ajout
 */
export function ProductCard({ produit, onAddToCart }: ProductCardProps) {
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

  return (
    <div className="group relative bg-background rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      {/* Image sans lien */}
      <div className="block">
        <div className="aspect-square relative bg-gradient-to-br from-accent/30 to-accent/10 overflow-hidden">
          {produit.image_url ? (
            <Image
              src={produit.image_url}
              alt={produit.nom}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent/30">
              <span className="text-5xl font-semibold text-muted-foreground/40">
                {produit.nom.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Overlay gradient au hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {produit.stock <= produit.seuil_alerte && produit.stock > 0 && (
              <span className="px-2.5 py-1 bg-orange-500 text-white text-xs font-medium rounded-full shadow-sm">
                Stock faible
              </span>
            )}
            {produit.stock === 0 && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-medium rounded-full shadow-sm">
                Rupture
              </span>
            )}
          </div>

          {/* Prix badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md">
            <span className="text-sm font-bold text-primary">
              {formatPrice(produit.prix)}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              /{produit.unite}
            </span>
          </div>
        </div>
      </div>

      {/* Infos - flex-1 pour pousser le bouton en bas */}
      <div className="p-4 flex flex-col flex-1">
        {/* Contenu texte */}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {produit.nom}
          </h3>

          {/* Stock disponible */}
          {produit.stock > 0 && produit.stock <= 10 && (
            <p className="text-xs text-muted-foreground mt-1.5">
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
              mt-2.5 w-full flex items-center justify-center gap-2
              py-2 px-4 rounded-lg
              text-sm font-medium
              whitespace-nowrap
              transition-all duration-300
              ${justAdded
                ? 'bg-green-500 text-white'
                : isDisabled
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:scale-95'
              }
            `}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>Ajoute</span>
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
