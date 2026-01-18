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
          {/* Fond sombre avec blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu panel moderne - détaché avec coins arrondis */}
          <nav
            className="
              fixed top-4 right-4 bottom-4
              w-80 max-w-[calc(100vw-2rem)]
              bg-white
              rounded-2xl
              shadow-2xl
              z-[101]
              flex flex-col
              animate-in slide-in-from-right duration-300
              border border-gray-200
            "
            aria-label="Menu principal"
          >
            {/* Header du menu avec bouton fermer */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Menu
              </h2>
              <button
                type="button"
                onClick={closeMenu}
                className="
                  p-2 rounded-full
                  hover:bg-red-50 hover:text-red-600
                  transition-all duration-200
                  group
                "
                aria-label="Fermer le menu"
              >
                <X className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" strokeWidth={2.5} />
              </button>
            </div>

            {/* Liste de liens avec scroll */}
            <ul className="flex-1 overflow-y-auto p-6 space-y-2">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={`
                        block py-3 px-4 text-base font-medium
                        rounded-xl
                        transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Lien connexion */}
            <div className="p-6 pt-4 border-t border-gray-200">
              <Link
                href="/connexion"
                onClick={closeMenu}
                className="
                  block w-full py-3.5 px-4
                  bg-gradient-to-r from-green-500 to-emerald-600
                  text-white
                  rounded-full text-center font-bold text-sm
                  hover:from-green-600 hover:to-emerald-700
                  transition-all duration-300
                  shadow-lg shadow-green-500/30
                  hover:shadow-green-500/50
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
