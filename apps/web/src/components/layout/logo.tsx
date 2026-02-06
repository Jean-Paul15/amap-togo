// Logo AMAP TOGO
// Composant reutilisable pour le logo du site

import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  className?: string
  url?: string
}

/**
 * Logo AMAP TOGO avec lien vers l'accueil
 */
export function Logo({ className = '', url }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 ${className}`}
      aria-label="AMAP TOGO - Accueil"
    >
      <div className="relative w-32 h-12">
        <Image
          src={url || "/favicon.svg"}
          alt="AMAP TOGO"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  )
}
