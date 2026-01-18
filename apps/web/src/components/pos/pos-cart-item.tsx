// Ligne article dans le panier POS
// Nom, prix, quantite, boutons +/-, supprimer

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { formatPrice } from '@amap-togo/utils'
import { useCartStore } from '@/stores/cart-store'

interface CartItem {
  id: string
  type: 'produit' | 'panier'
  nom: string
  prix: number
  quantite: number
  unite?: string
  imageUrl?: string
}

interface POSCartItemProps {
  item: CartItem
}

/**
 * Ligne d'un article dans le panier
 */
export function POSCartItem({ item }: POSCartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(item.quantite.toString())

  const handleDecrement = () => {
    if (item.quantite > 1) {
      updateQuantity(item.id, item.quantite - 1)
      setInputValue((item.quantite - 1).toString())
    } else {
      removeItem(item.id)
    }
  }

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantite + 1)
    setInputValue((item.quantite + 1).toString())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Autoriser uniquement les chiffres
    if (/^\d*$/.test(value)) {
      setInputValue(value)
    }
  }

  const handleInputBlur = () => {
    const newQuantity = parseInt(inputValue) || 1
    if (newQuantity < 1) {
      setInputValue('1')
      updateQuantity(item.id, 1)
    } else {
      updateQuantity(item.id, newQuantity)
      setInputValue(newQuantity.toString())
    }
    setIsEditing(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    } else if (e.key === 'Escape') {
      setInputValue(item.quantite.toString())
      setIsEditing(false)
    }
  }

  return (
    <div className="flex gap-3 p-3 bg-background border border-border rounded-lg">
      {/* Image */}
      <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.nom}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl">
              {item.type === 'panier' ? '🧺' : '🥬'}
            </span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">
          {item.nom}
        </h4>
        <p className="text-xs text-muted-foreground">
          {formatPrice(item.prix)} {item.unite && `/ ${item.unite}`}
        </p>

        {/* Controles quantite */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleDecrement}
            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label="Reduire la quantite"
          >
            <Minus className="w-3 h-3" />
          </button>
          
          {isEditing ? (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              autoFocus
              aria-label="Modifier la quantite"
              className="w-10 h-7 text-sm font-medium text-center bg-background border border-primary rounded px-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-10 h-7 text-sm font-medium text-center hover:bg-muted rounded transition-colors"
            >
              {item.quantite}
            </button>
          )}
          
          <button
            onClick={handleIncrement}
            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label="Augmenter la quantite"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Sous-total et supprimer */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(item.id)}
          className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
          aria-label="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {formatPrice(item.prix * item.quantite)}
        </span>
      </div>
    </div>
  )
}
