// Filtre par categorie
// Affiche les categories pour filtrer les produits

'use client'

import type { Categorie } from '@amap-togo/database'

interface CategoryFilterProps {
  categories: Categorie[]
  selectedId: string | null
  onSelect: (categoryId: string | null) => void
}

/**
 * Filtres lateraux par categorie
 */
export function CategoryFilter({ 
  categories, 
  selectedId, 
  onSelect 
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-foreground mb-3">Categories</h3>
      
      <button
        onClick={() => onSelect(null)}
        className={`
          w-full text-left px-3 py-2 rounded-lg text-sm
          transition-colors duration-150
          ${selectedId === null 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-accent text-foreground'
          }
        `}
      >
        Toutes les categories
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`
            w-full text-left px-3 py-2 rounded-lg text-sm
            transition-colors duration-150
            ${selectedId === category.id 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-accent text-foreground'
            }
          `}
        >
          {category.nom}
        </button>
      ))}
    </div>
  )
}
