// Barre de recherche produits
// Recherche par nom de produit

'use client'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * Barre de recherche avec icone et bouton effacer
 */
export function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Rechercher un produit...' 
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" 
        strokeWidth={1.5}
      />
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-10 py-3
          bg-background border border-border rounded-lg
          text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          transition-colors duration-150
        "
      />

      {value && (
        <button
          onClick={() => onChange('')}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            p-1 rounded-full hover:bg-accent
            transition-colors duration-150
          "
          aria-label="Effacer la recherche"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}
