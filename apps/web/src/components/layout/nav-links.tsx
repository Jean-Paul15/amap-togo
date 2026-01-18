// Navigation principale du site
// Liens vers les pages principales

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** Liens de navigation du site */
export const navigationLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/produits', label: 'Produits' },
  { href: '/paniers', label: 'Paniers AMAP' },
  { href: '/a-propos', label: 'À propos' },
] as const

interface NavLinksProps {
  className?: string
  onLinkClick?: () => void
}

/**
 * Liens de navigation
 * Utilise dans le header desktop et le menu mobile
 */
export function NavLinks({ className = '', onLinkClick }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className={className}>
      <ul className="flex gap-6 lg:gap-8">
        {navigationLinks.map((link) => {
          const isActive = pathname === link.href

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onLinkClick}
                className={`
                  text-sm font-medium transition-colors duration-150
                  hover:text-primary
                  ${isActive ? 'text-primary' : 'text-foreground'}
                `}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
