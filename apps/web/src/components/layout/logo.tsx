// Logo AMAP TOGO
// Composant reutilisable pour le logo du site

import Link from 'next/link'

interface LogoProps {
  className?: string
  showText?: boolean
}

/**
 * Logo AMAP TOGO avec lien vers l'accueil
 */
export function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={`flex items-center gap-2 ${className}`}
      aria-label="AMAP TOGO - Accueil"
    >
      {/* Icone feuille stylisee */}
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-5 h-5 text-white"
          aria-hidden="true"
        >
          <path 
            d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.1 2.6-.3.4-.1.7-.5.7-.9V18c0-.6-.4-1-1-1h-2c-2.2 0-4-1.8-4-4s1.8-4 4-4h2c.6 0 1-.4 1-1V5.2c0-.4-.3-.8-.7-.9-.8-.2-1.7-.3-2.6-.3z" 
            fill="currentColor"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-primary leading-tight">
            AMAP TOGO
          </span>
          <span className="text-xs text-muted-foreground leading-tight">
            Bio et Local
          </span>
        </div>
      )}
    </Link>
  )
}
