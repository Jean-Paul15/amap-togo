// Menu de navigation mobile
// Menu hamburger avec overlay

'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navigationLinks } from './nav-links'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Menu hamburger pour la navigation mobile
 * Overlay plein ecran avec animation
 */
export function NavMobile() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <div className="md:hidden">
      {/* Bouton hamburger */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-5 h-5" strokeWidth={1.5} />
        ) : (
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        )}
      </button>

      {/* Overlay menu */}
      {isOpen && (
        <>
          {/* Fond sombre - opacité augmentée pour meilleure lisibilité */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu panel - fond opaque blanc */}
          <nav
            className="
              fixed top-16 right-0 bottom-0 w-64
              bg-background/95 backdrop-blur-md border-l border-border
              shadow-2xl
              z-50 p-6
              animate-in slide-in-from-right duration-200
            "
            aria-label="Menu principal"
          >
            <ul className="space-y-4">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={`
                        block py-2 text-lg font-medium
                        transition-colors duration-150
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

            {/* Lien connexion */}
            <div className="mt-8 pt-8 border-t border-border">
              <Link
                href="/connexion"
                onClick={closeMenu}
                className="
                  block w-full py-3 px-4
                  bg-primary text-primary-foreground
                  rounded-lg text-center font-medium
                  hover:bg-primary/90 transition-colors
                "
              >
                Se connecter
              </Link>
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
