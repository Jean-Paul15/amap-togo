// Composant detail d'un produit
// Affiche image grande, description, prix et bouton ajouter

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@amap-togo/utils'
import { useCartStore } from '@/stores/cart-store'
import type { Produit } from '@amap-togo/database'

interface ProductDetailProps {
  produit: Produit
}

/**
 * Detail complet d'un produit avec selection de quantite
 */
export function ProductDetail({ produit }: ProductDetailProps) {
  const [quantite, setQuantite] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    for (let i = 0; i < quantite; i++) {
      addItem({
        id: produit.id,
        type: 'produit',
        nom: produit.nom,
        prix: produit.prix,
        unite: produit.unite,
        imageUrl: produit.image_url || undefined,
      })
    }
    setQuantite(1)
  }

  const incrementQuantite = () => {
    if (quantite < produit.stock) {
      setQuantite((q) => q + 1)
    }
  }

  const decrementQuantite = () => {
    if (quantite > 1) {
      setQuantite((q) => q - 1)
    }
  }

  const isOutOfStock = produit.stock === 0 || produit.stock === null || produit.stock === undefined
  const isLowStock = produit.stock > 0 && produit.stock <= produit.seuil_alerte

  return (
    <div>
      {/* Lien retour */}
      <Link
        href="/produits"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux produits
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="aspect-square relative bg-secondary rounded-xl overflow-hidden">
          {produit.image_url ? (
            <Image
              src={produit.image_url}
              alt={produit.nom}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent/30">
              <span className="text-6xl text-muted-foreground/30 font-medium">
                {produit.nom.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">
              {produit.nom}
            </h1>
            <p className="mt-2 text-2xl text-primary font-medium">
              {formatPrice(produit.prix)} / {produit.unite}
            </p>
          </div>

          {/* Stock */}
          <div>
            {isOutOfStock ? (
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                Rupture de stock
              </span>
            ) : isLowStock ? (
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
                Plus que {produit.stock} en stock
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                En stock ({produit.stock} disponibles)
              </span>
            )}
          </div>

          {/* Description */}
          {produit.description && (
            <p className="text-muted-foreground leading-relaxed">
              {produit.description}
            </p>
          )}

          {/* Sélection quantité et ajout - toujours visible si en stock */}
          <div className="space-y-4 pt-4 border-t border-border">
            {isOutOfStock ? (
              <p className="text-center text-muted-foreground py-4">
                Ce produit est actuellement indisponible
              </p>
            ) : (
              <>
                {/* Sélecteur quantité */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Quantité</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decrementQuantite}
                      disabled={quantite <= 1}
                      aria-label="Diminuer la quantité"
                      className="
                        p-2 rounded-lg border border-border
                        hover:bg-accent disabled:opacity-50
                        transition-colors
                      "
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantite}</span>
                    <button
                      onClick={incrementQuantite}
                      disabled={quantite >= produit.stock}
                      aria-label="Augmenter la quantité"
                      className="
                        p-2 rounded-lg border border-border
                        hover:bg-accent disabled:opacity-50
                        transition-colors
                      "
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bouton ajouter */}
                <button
                  onClick={handleAddToCart}
                  className="
                    w-full flex items-center justify-center gap-2
                    py-3 px-6 rounded-lg
                    bg-primary text-primary-foreground
                    font-medium
                    hover:bg-primary/90 transition-colors
                  "
                >
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier - {formatPrice(produit.prix * quantite)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
