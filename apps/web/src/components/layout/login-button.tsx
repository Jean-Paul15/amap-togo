// Bouton de connexion utilisateur
// Affiche icone User + texte "Connexion" ou avatar si connecte

'use client'

import { User } from 'lucide-react'

interface LoginButtonProps {
  onClick: () => void
  isLoggedIn?: boolean
  userName?: string
  className?: string
}

/**
 * Bouton de connexion / profil utilisateur
 * Ouvre le modal d'authentification glassmorphism
 */
export function LoginButton({ 
  onClick, 
  isLoggedIn = false, 
  userName,
  className = '' 
}: LoginButtonProps) {
  if (isLoggedIn && userName) {
    return (
      <button
        onClick={onClick}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          hover:bg-accent transition-colors duration-150
          ${className}
        `}
        aria-label="Menu utilisateur"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-primary-foreground">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:inline text-sm font-medium text-foreground">
          {userName}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        hover:bg-accent transition-colors duration-150
        ${className}
      `}
      aria-label="Se connecter"
    >
      <User className="w-5 h-5 text-foreground" strokeWidth={1.5} />
      <span className="hidden sm:inline text-sm font-medium text-foreground">
        Connexion
      </span>
    </button>
  )
}
