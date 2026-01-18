// Liste du contenu d'un panier AMAP
// Affiche les produits inclus dans le panier

import type { PanierContenu } from '@amap-togo/database'

interface BasketContentProps {
  contenu: PanierContenu[]
}

/**
 * Liste des produits dans un panier AMAP
 */
export function BasketContent({ contenu }: BasketContentProps) {
  if (contenu.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Contenu non encore defini
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {contenu.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between text-sm"
        >
          <span className="text-foreground">
            {item.produit?.nom || 'Produit'}
          </span>
          <span className="text-muted-foreground">
            x{item.quantite} {item.produit?.unite || ''}
          </span>
        </li>
      ))}
    </ul>
  )
}
