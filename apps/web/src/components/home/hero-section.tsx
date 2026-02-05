'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Leaf, Truck, Star } from 'lucide-react'
import { Button } from '@amap-togo/ui'

/**
 * Section Hero "Voyage & Magie"
 * - Design immersif avec fond sombre/organique
 * - Illustration 3D centrale
 * - Particules et effets de profondeur
 */
export function HeroSection() {
  const { scrollY } = useScroll()

  // Parallax et disparitions
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 1.1])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a1f12] text-white">

      {/* --- BACKGROUND IMMERSIF --- */}
      {/* Image de fond texturée subtile (optionnelle, ici générée par CSS) */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/40 via-[#0a1f12] to-[#0a1f12]" />

      {/* Orbes lumineux d'ambiance */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-green-500/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]" />
      <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-yellow-400/5 rounded-full blur-[80px]" />

      {/* Particules "Lucioles" */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * -100 + "px"],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* --- CONTENT (GAUCHE) --- */}
          <div className="text-center lg:text-left order-2 lg:order-1 relative">

            {/* Petit badge brillant */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-green-300 text-sm font-medium mb-8 overflow-hidden"
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-3 h-3 fill-current" />
              </motion.span>
              <span>L'expérience Bio Premium</span>
            </motion.div>

            {/* Titre Majestueux */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white"
            >
              Le Goût du <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-yellow-200 drop-shadow-lg">
                Vrai Monde.
              </span>
            </motion.h1>

            {/* Description Poétique */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Laissez-vous transporter par la saveur intense de nos terres.
              Des paniers d'exception, cultivés avec amour, livrés avec magie.
            </motion.p>

            {/* CTA Boutons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
            >
              <Link href="/paniers">
                <Button size="lg" className="group relative w-full sm:w-auto rounded-full px-8 py-7 text-lg bg-white text-green-900 overflow-hidden font-bold hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    Explorer les Paniers <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/cultures">
                <button className="group flex items-center gap-3 px-8 py-4 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-all">
                  <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all">
                    <span className="text-xl">📷</span>
                  </div>
                  <span className="font-medium text-lg">Nos cultures</span>
                </button>
              </Link>
            </motion.div>
          </div>

          {/* --- VISUAL 3D (DROITE) --- */}
          <div className="relative h-[500px] lg:h-[800px] w-full flex items-center justify-center pointer-events-none order-1 lg:order-2">
            <motion.div style={{ y: y1, scale }} className="relative w-full h-full flex items-center justify-center perspective-[1200px]">

              {/* Halo Derrière le panier */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-500/20 rounded-full blur-[100px]" />

              {/* Panier 3D Flottant */}
              <motion.div
                animate={{
                  y: [-15, 15, -15],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-20 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <Image
                  src="/images/hero-basket-3d.png"
                  alt="Panier Bio Magique"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Éléments en orbite (Cartes Glassmorphism Sombres) */}
              <motion.div
                animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-[20%] right-0 lg:right-[-20px] z-30 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl w-48 pointer-events-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Fraîcheur</div>
                    <div className="text-sm font-bold text-white">Récolté à l'aube</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="absolute bottom-[20%] left-0 lg:left-[-20px] z-30 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl w-48 pointer-events-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-orange-500/20 text-orange-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Service</div>
                    <div className="text-sm font-bold text-white">Livré le jour J</div>
                  </div>
                </div>
              </motion.div>

              {/* Particules décoratives en fond d'orbite */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] rounded-full border border-dashed border-green-500/10 z-0"
              />

            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll indicator élégant */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] font-bold text-green-400 uppercase tracking-[0.2em] animate-pulse">Découvrir</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-green-400 to-transparent opacity-50" />
      </motion.div>

    </section>
  )
}
