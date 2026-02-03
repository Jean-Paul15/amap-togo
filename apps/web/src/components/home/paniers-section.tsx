// Section des paniers AMAP
// Affiche les types de paniers depuis la base de donnees avec animations

'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Check } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { formatPrice } from '@amap-togo/utils'
import type { PanierType } from '@amap-togo/database'

interface PanierSectionProps {
  paniers: PanierType[]
}

interface PanierCardProps {
  nom: string
  prix: number
  description: string
  contenuExemple: string[]
  populaire?: boolean
}

const descriptions: Record<string, string> = {
  petit: 'Idéal pour 1 à 2 personnes, une sélection de légumes frais.',
  grand: 'Pour les familles, une grande variété de légumes et fruits.',
  local: 'Uniquement des produits traditionnels togolais.',
}

const contenuExemples: Record<string, string[]> = {
  petit: ['Tomates', 'Oignons', 'Gombo', 'Piment'],
  grand: ['Tomates', 'Carottes', 'Choux', 'Bananes', 'Ignames'],
  local: ['Ademe', 'Gboma', 'Gombo', 'Gari'],
}

/**
 * Section présentant les types de paniers AMAP
 * Design moderne avec animations au scroll
 */

export function PaniersSection({ paniers }: PanierSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 relative overflow-hidden bg-[#0d2616]">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-[#0d2616] to-[#0a1f12]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-green-300 rounded-full text-sm font-medium mb-4"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
            <span>Paniers hebdomadaires</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Nos paniers{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-300">
              sur mesure
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Chaque semaine, recevez un panier composé par nos soins
            avec les meilleurs produits de saison.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {paniers.map((panier, idx) => (
            <motion.div key={panier.id} variants={cardVariants}>
              <PanierCard
                nom={panier.nom}
                prix={panier.prix}
                description={descriptions[panier.type] || panier.description || panier.nom}
                contenuExemple={contenuExemples[panier.type] || []}
                populaire={idx === 1}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Link
            href="/paniers"
            className="
              inline-flex items-center gap-2
              text-green-400 font-semibold text-base
              hover:text-green-300
              group
            "
          >
            Voir tous les paniers de la semaine
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/** Carte d'un type de panier avec animations */
function PanierCard({ nom, prix, description, contenuExemple, populaire }: PanierCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        relative rounded-2xl p-6
        border transition-all duration-300 h-full flex flex-col group
        ${populaire
          ? 'bg-white/10 border-green-500/50 shadow-2xl shadow-green-900/40 backdrop-blur-xl'
          : 'bg-white/5 border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/20 backdrop-blur-md'
        }
      `}
    >
      {/* Badge populaire */}
      {populaire && (
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
          className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
        >
          ⭐ Populaire
        </motion.div>
      )}

      {/* Icône */}
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center mb-4
          ${populaire
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
            : 'bg-white/10 text-green-400'
          }
        `}
      >
        <ShoppingBag
          className="w-6 h-6"
          strokeWidth={2}
        />
      </motion.div>

      {/* Nom */}
      <h3 className="text-xl font-bold text-white mb-2">
        {nom}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">
        {description}
      </p>

      {/* Exemple de contenu */}
      <div className="mb-4 flex-1">
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Exemple de contenu :
        </p>
        <div className="space-y-1.5">
          {contenuExemple.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="flex-shrink-0 w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-green-400" strokeWidth={3} />
              </div>
              <span className="text-sm text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prix et CTA */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-0.5">À partir de</div>
            <div className="text-2xl font-bold text-white">
              {formatPrice(prix)}
            </div>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/paniers"
            className={`
              block w-full text-center py-3 rounded-full font-bold text-sm
              transition-all duration-300
              ${populaire
                ? 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/40'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }
            `}
          >
            Commander
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
