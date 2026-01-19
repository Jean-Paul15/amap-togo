// Menu utilisateur connecte
// Portal sur mobile, dropdown sur desktop

'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, ChevronDown, LayoutDashboard, X } from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { useAuth } from '@/hooks/use-auth'

/**
 * Menu utilisateur avec Portal sur mobile
 */
export function UserMenu() {
  const { profile } = useUser()
  const { signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Monter cote client pour Portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fermer le menu au clic exterieur (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Bloquer scroll sur mobile quand ouvert
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!profile) return null

  const initials = `${profile.prenom.charAt(0)}${profile.nom.charAt(0)}`.toUpperCase()

  // Contenu du menu (partage entre mobile et desktop)
  const menuContent = (
    <>
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm font-medium text-foreground">
          {profile.prenom} {profile.nom}
        </p>
        <p className="text-xs text-muted-foreground">{profile.email}</p>
      </div>
      <div className="py-2">
        <a
          href="/dashboard"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-4 py-3 text-sm text-primary font-medium hover:bg-primary/10 transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
          Tableau de bord
        </a>
      </div>
      <div className="border-t border-border py-2">
        <button
          onClick={async (e) => { 
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(false)
            try {
              await signOut()
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error)
              // Forcer le rechargement
              window.location.href = '/'
            }
          }}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </>
  )

  // Menu mobile Portal
  const mobileMenu = mounted ? createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 z-[9999] lg:hidden"
          />
          {/* Menu centre */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-[9999] left-4 right-4 top-24 max-w-xs mx-auto bg-background rounded-2xl shadow-2xl border border-border lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold">Mon compte</span>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            {menuContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  ) : null

  return (
    <div ref={menuRef} className="relative">
      {/* Bouton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-foreground">
          {profile.prenom}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown desktop */}
      {isOpen && (
        <div className="hidden lg:block absolute right-0 top-full mt-2 w-56 py-2 bg-background border border-border rounded-xl shadow-lg z-50">
          {menuContent}
        </div>
      )}

      {/* Menu mobile via Portal */}
      {mobileMenu}
    </div>
  )
}
