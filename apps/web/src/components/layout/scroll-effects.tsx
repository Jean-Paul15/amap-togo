// Effets visuels au scroll pour toute la page
// Animations subtiles et professionnelles

'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'

/**
 * Composant ajoutant des effets visuels au scroll
 * - Barre de progression en haut
 * - Effets de parallaxe
 * - Animations fluides
 */
export function ScrollEffects() {
  const { scrollYProgress } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Barre de progression en haut de la page */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Bouton "Retour en haut" qui apparaît au scroll */}
      {isScrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="
            fixed bottom-8 right-8 z-50
            w-12 h-12 sm:w-14 sm:h-14
            rounded-full
            bg-gradient-to-br from-green-500 to-emerald-600
            text-white
            shadow-2xl shadow-green-500/50
            flex items-center justify-center
            hover:shadow-green-500/70
            transition-all duration-300
            border-2 border-white/20
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </motion.button>
      )}
    </>
  )
}
