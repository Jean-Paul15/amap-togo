// Section des paniers AMAP
// Affiche les 3 types de paniers avec prix et animations

'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Check } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { formatPrice } from '@amap-togo/utils'

/** Définition d'un type de panier */
interface PanierInfo {
  type: string
  nom: string
  prix: number
  description: string
  contenuExemple: string[]
  populaire?: boolean
}

const paniers: PanierInfo[] = [
  {
    type: 'petit',
    nom: 'Petit panier classique',
    prix: 4500,
    description: 'Idéal pour 1 à 2 personnes, une sélection de légumes frais.',
    contenuExemple: ['Tomates', 'Oignons', 'Gombo', 'Piment'],
  },
  {
    type: 'grand',
    nom: 'Grand panier classique',
    prix: 8000,
    description: 'Pour les familles, une grande variété de légumes et fruits.',
    contenuExemple: ['Tomates', 'Carottes', 'Choux', 'Bananes', 'Ignames'],
    populaire: true,
  },
  {
    type: 'local',
    nom: 'Panier 100% local',
    prix: 4000,
    description: 'Uniquement des produits traditionnels togolais.',
    contenuExemple: ['Ademe', 'Gboma', 'Gombo', 'Gari'],
  },
]

/**
 * Section présentant les 3 types de paniers AMAP
 * Design moderne avec animations au scroll
 */
export function PaniersSection() {
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
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50/50" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />

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
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium mb-4"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
            <span>Paniers hebdomadaires</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Nos paniers{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              sur mesure
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
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
          {paniers.map((panier) => (
            <motion.div key={panier.type} variants={cardVariants}>
              <PanierCard {...panier} />
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
              text-green-600 font-semibold text-base
              hover:text-green-700
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
function PanierCard({ nom, prix, description, contenuExemple, populaire }: PanierInfo) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        relative bg-white rounded-2xl p-4
        border-2 transition-all duration-300 h-full flex flex-col
        ${populaire
          ? 'border-green-500 shadow-xl shadow-green-500/20'
          : 'border-gray-200 hover:border-green-300 shadow-lg hover:shadow-xl'
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
          w-10 h-10 rounded-xl flex items-center justify-center mb-3
          ${populaire
            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
            : 'bg-gradient-to-br from-green-100 to-emerald-100'
          }
        `}
      >
        <ShoppingBag
          className={`w-5 h-5 ${populaire ? 'text-white' : 'text-green-600'}`}
          strokeWidth={2}
        />
      </motion.div>

      {/* Nom */}
      <h3 className="text-base font-bold text-foreground mb-1.5">
        {nom}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
        {description}
      </p>

      {/* Exemple de contenu */}
      <div className="mb-3 flex-1">
        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
          Exemple de contenu :
        </p>
        <div className="space-y-1">
          {contenuExemple.map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <div className="flex-shrink-0 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-green-600" strokeWidth={3} />
              </div>
              <span className="text-xs text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prix et CTA */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">À partir de</div>
            <div className="text-xl font-bold text-green-600">
              {formatPrice(prix)}
            </div>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/paniers"
            className={`
              block w-full text-center py-2.5 rounded-full font-bold text-sm
              transition-all duration-300
              ${populaire
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/40 border-2 border-white/20'
                : 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200'
              }
            `}
          >
            Voir les paniers
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
