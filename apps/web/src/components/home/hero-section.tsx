// Section Hero de la page d'accueil
// Message principal et appel a l'action

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/**
 * Section hero avec message d'accroche
 * Animation subtile au chargement
 * Optimise mobile-first
 */
export function HeroSection() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
      {/* Fond decoratif */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-accent/30 to-transparent" 
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight"
          >
            Des produits bio et locaux, 
            <span className="text-primary"> du producteur à votre table</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            AMAP TOGO vous propose des paniers de produits frais, 
            cultivés par des agriculteurs locaux engagés dans une démarche bio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Link
              href="/paniers"
              className="
                inline-flex items-center justify-center gap-2
                px-5 sm:px-6 py-3 rounded-lg
                bg-primary text-primary-foreground
                font-medium text-sm sm:text-base
                hover:bg-primary/90 transition-colors
              "
            >
              Découvrir nos paniers
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/produits"
              className="
                inline-flex items-center justify-center gap-2
                px-5 sm:px-6 py-3 rounded-lg
                bg-secondary text-foreground
                font-medium text-sm sm:text-base
                hover:bg-secondary/80 transition-colors
              "
            >
              Voir les produits
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
