// Header principal du site AMAP TOGO
// Navigation desktop avec logo, liens au centre, actions a droite

'use client'

import { useState, useEffect } from 'react'
import { Logo } from './logo'
import { NavLinks } from './nav-links'
import { NavMobile } from './nav-mobile'
import { POSTrigger, CartBadge } from '@/components/pos'
import { AuthButton } from '@/components/auth'

/**
 * Header du site avec navigation responsive
 * Structure : Logo (gauche) | Navigation (centre) | Actions (droite)
 * Header fixe avec shadow au scroll
 */
export function Header({ logoUrl }: { logoUrl?: string }) {
  const [hasScrolled, setHasScrolled] = useState(false)

  // Detection du scroll pour ajouter le shadow
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-40 
        bg-background/95 backdrop-blur-sm 
        border-b border-border
        transition-shadow duration-200
        ${hasScrolled ? 'shadow-sm' : ''}
      `}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Gauche */}
          <Logo url={logoUrl} />

          {/* Navigation desktop - Centre (cachee sur mobile) */}
          <NavLinks className="hidden md:flex absolute left-1/2 -translate-x-1/2" />

          {/* Actions - Droite */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Bouton POS - visible sur tous les ecrans */}
            <POSTrigger />

            {/* Badge panier */}
            <CartBadge />

            {/* Bouton Auth (connexion ou menu utilisateur) */}
            <AuthButton />

            {/* Menu hamburger - visible uniquement sur mobile */}
            <NavMobile />
          </div>
        </div>
      </div>
    </header>
  )
}
