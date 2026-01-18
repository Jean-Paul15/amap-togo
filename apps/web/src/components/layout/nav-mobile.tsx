// Menu de navigation mobile
// Menu hamburger moderne flottant avec portal

'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X, Home, ShoppingBag, Package, Users } from 'lucide-react'
import { navigationLinks } from './nav-links'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Icones pour chaque lien
const linkIcons: Record<string, React.ReactNode> = {
  '/': <Home className="w-4 h-4" />,
  '/produits': <Package className="w-4 h-4" />,
  '/paniers': <ShoppingBag className="w-4 h-4" />,
  '/a-propos': <Users className="w-4 h-4" />,
}

/**
 * Menu hamburger moderne et flottant
 * Utilise un portal pour s'afficher au-dessus de tout
 */
export function NavMobile() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  // Monter le composant cote client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Fermer le menu quand on change de page
  useEffect(() => {
    closeMenu()
  }, [pathname])

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop opaque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/90"
            onClick={closeMenu}
          />

          {/* Menu central compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="absolute left-4 right-4 top-24 max-w-xs mx-auto"
          >
            <nav className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Header compact */}
              <div className="flex items-center justify-between px-4 py-3 bg-primary">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>

              {/* Liens */}
              <ul className="py-1">
                {navigationLinks.map((link) => {
                  const isActive = pathname === link.href
                  const Icon = linkIcons[link.href]

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className={`
                          flex items-center gap-3 px-4 py-2.5
                          text-sm font-medium transition-colors
                          ${isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className={isActive ? 'text-primary' : 'text-gray-400'}>
                          {Icon}
                        </span>
                        {link.label}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="md:hidden">
      {/* Bouton hamburger */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-5 h-5 text-gray-700" strokeWidth={2} />
      </button>

      {/* Portal pour le menu */}
      {mounted && createPortal(menuContent, document.body)}
    </div>
  )
}
