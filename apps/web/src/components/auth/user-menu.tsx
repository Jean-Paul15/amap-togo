// Menu utilisateur connecte
// Dropdown avec actions

'use client'

import { useState, useRef, useEffect } from 'react'
import { LogOut, ChevronDown, LayoutDashboard } from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { useAuth } from '@/hooks/use-auth'

/**
 * Menu dropdown pour l'utilisateur connecte
 */
export function UserMenu() {
  const { profile } = useUser()
  const { signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu au clic exterieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!profile) return null

  const initials = `${profile.prenom.charAt(0)}${profile.nom.charAt(0)}`.toUpperCase()

  return (
    <div ref={menuRef} className="relative">
      {/* Bouton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-3 py-2
          hover:bg-muted rounded-lg transition-colors
        "
      >
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-foreground">
          {profile.prenom}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="
          absolute right-0 top-full mt-2
          w-56 py-2
          bg-background border border-border rounded-xl shadow-lg
          z-50
        ">
          {/* En-tete */}
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-medium text-foreground">
              {profile.prenom} {profile.nom}
            </p>
            <p className="text-xs text-muted-foreground">
              {profile.email}
            </p>
          </div>

          {/* Liens */}
          <div className="py-1">
            {/* Lien Dashboard pour tous */}
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 text-sm text-primary font-medium hover:bg-primary/10 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Tableau de bord
            </a>
            {/* Mon compte et Mes commandes - masques pour l'instant */}
          </div>

          {/* Deconnexion */}
          <div className="border-t border-border py-1">
            <button
              onClick={() => {
                setIsOpen(false)
                signOut()
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Deconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
