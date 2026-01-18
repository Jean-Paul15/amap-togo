// Liste des destinataires pour la diffusion
// Affiche les emails avec checkbox

'use client'

import { useState } from 'react'
import { Search, CheckSquare, Square, Users, User, ShoppingBag } from 'lucide-react'
import type { EmailEntry } from '@/hooks/admin/use-diffusion-emails'

interface RecipientsListProps {
  emails: EmailEntry[]
  selectedEmails: string[]
  isLoading: boolean
  onToggle: (email: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function RecipientsList({
  emails,
  selectedEmails,
  isLoading,
  onToggle,
  onSelectAll,
  onDeselectAll
}: RecipientsListProps) {
  const [search, setSearch] = useState('')
  const [filterSource, setFilterSource] = useState<'all' | 'profil' | 'commande'>('all')

  // Filtrer les emails
  const filteredEmails = emails.filter(entry => {
    const matchSearch = 
      entry.email.toLowerCase().includes(search.toLowerCase()) ||
      entry.nom.toLowerCase().includes(search.toLowerCase())
    
    const matchSource = filterSource === 'all' || entry.source === filterSource

    return matchSearch && matchSource
  })

  const allSelected = filteredEmails.length > 0 && 
    filteredEmails.every(e => selectedEmails.includes(e.email))

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* En-tete */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            Destinataires
          </h3>
          <span className="text-sm text-muted-foreground">
            {emails.length} email(s)
          </span>
        </div>

        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filtres source */}
        <div className="flex gap-2 mt-3">
          <FilterButton
            active={filterSource === 'all'}
            onClick={() => setFilterSource('all')}
          >
            Tous
          </FilterButton>
          <FilterButton
            active={filterSource === 'profil'}
            onClick={() => setFilterSource('profil')}
          >
            <User className="w-3 h-3" />
            Profils
          </FilterButton>
          <FilterButton
            active={filterSource === 'commande'}
            onClick={() => setFilterSource('commande')}
          >
            <ShoppingBag className="w-3 h-3" />
            Commandes
          </FilterButton>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {allSelected ? (
            <>
              <Square className="w-3 h-3" />
              Tout deselectionner
            </>
          ) : (
            <>
              <CheckSquare className="w-3 h-3" />
              Tout selectionner
            </>
          )}
        </button>
        <span className="text-xs text-muted-foreground">
          {selectedEmails.length} selectionne(s)
        </span>
      </div>

      {/* Liste */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Chargement...</p>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun email trouve</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredEmails.map((entry) => (
              <li key={entry.email}>
                <button
                  onClick={() => onToggle(entry.email)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    selectedEmails.includes(entry.email)
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border'
                  }`}>
                    {selectedEmails.includes(entry.email) && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.nom}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {entry.email}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    entry.source === 'profil'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {entry.source === 'profil' ? 'Profil' : 'Commande'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// Bouton filtre
function FilterButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean
  onClick: () => void
  children: React.ReactNode 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-background border border-border text-muted-foreground hover:bg-muted'
      }`}
    >
      {children}
    </button>
  )
}
