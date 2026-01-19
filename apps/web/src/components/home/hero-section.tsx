// Section Hero de la page d'accueil
// Message principal et appel à l'action avec vidéo background

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

/**
 * Section hero moderne avec vidéo background
 * Animations fluides et professionnelles
 * Mobile-first avec overlay optimisé
 */
export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center overflow-hidden">
      {/* Vidéo background avec fallback image */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-fallback.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/videos/amap-hero-background.mp4" type="video/mp4" />
        </video>

        {/* Fallback : fond gradient si pas de video */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 opacity-50" />

        {/* Overlay gradient subtil pour lisibilite du texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      </div>

      {/* Particules flottantes décoratives */}
      <div className="absolute inset-0 z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: 0
            }}
            animate={{
              y: [null, Math.random() * -100 - 50 + '%'],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge animé */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium text-white">100% Bio & Local</span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            Des produits bio et locaux,{' '}
            <motion.span
              className="text-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              du producteur à votre table
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto"
          >
            AMAP TOGO vous propose des paniers de produits frais,
            cultivés par des agriculteurs locaux engagés dans une démarche bio.
          </motion.p>

          {/* Boutons CTA modernes ultra arrondis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link
                href="/paniers"
                className="
                  inline-flex items-center justify-center gap-3
                  px-8 sm:px-10 py-4 sm:py-5 rounded-full
                  bg-gradient-to-r from-green-400 via-green-500 to-emerald-600
                  text-white
                  font-bold text-base sm:text-lg
                  hover:from-green-500 hover:via-green-600 hover:to-emerald-700
                  transition-all duration-300
                  shadow-2xl shadow-green-500/50
                  hover:shadow-green-500/70
                  border-2 border-white/20
                "
              >
                Découvrir nos paniers
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link
                href="/produits"
                className="
                  inline-flex items-center justify-center gap-3
                  px-8 sm:px-10 py-4 sm:py-5 rounded-full
                  bg-white/15 backdrop-blur-xl
                  border-2 border-white/40
                  text-white
                  font-bold text-base sm:text-lg
                  hover:bg-white/25 hover:border-white/60
                  transition-all duration-300
                  shadow-xl shadow-white/10
                  hover:shadow-white/20
                "
              >
                Voir les produits
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats animées */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: '77', label: 'Producteurs bio' },
              { number: '155', label: 'Consommateurs' },
              { number: '15+', label: 'Années d\'expérience' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
