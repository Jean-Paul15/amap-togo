// Filtres categories pour le POS
// Liste horizontale scrollable

'use client'

import type { Categorie } from '@amap-togo/database'

interface POSCategoryFilterProps {
  categories: Categorie[]
  selected: string | null
  onSelect: (id: string | null) => void
}

/**
 * Onglets categories horizontaux
 */
export function POSCategoryFilter({
  categories,
  selected,
  onSelect,
}: POSCategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto p-3 scrollbar-hide">
      {/* Bouton Tous */}
      <button
        onClick={() => onSelect(null)}
        className={`
          px-3 py-1.5 rounded-full text-sm font-medium
          whitespace-nowrap transition-colors
          ${selected === null
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }
        `}
      >
        Tous
      </button>

      {/* Categories */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium
            whitespace-nowrap transition-colors
            ${selected === cat.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }
          `}
        >
          {cat.nom}
        </button>
      ))}
    </div>
  )
}
