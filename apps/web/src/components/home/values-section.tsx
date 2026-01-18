// Section des valeurs AMAP
// Présentation des engagements bio, local, solidaire avec animations

'use client'

import { useRef } from 'react'
import { Leaf, MapPin, Users } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

/** Valeur avec icône et description */
interface Value {
  icon: typeof Leaf
  title: string
  description: string
  color: string
}

const values: Value[] = [
  {
    icon: Leaf,
    title: 'Agriculture biologique',
    description:
      'Nos produits sont cultivés sans pesticides ni engrais chimiques, ' +
      'dans le respect de la terre et de votre santé.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: MapPin,
    title: 'Circuit court',
    description:
      'Du producteur à votre table, sans intermédiaire. ' +
      'Fraîcheur garantie et prix justes pour les agriculteurs.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Users,
    title: 'Économie solidaire',
    description:
      'En choisissant AMAP, vous soutenez directement les paysans togolais ' +
      'et participez à une économie locale et durable.',
    color: 'from-orange-500 to-red-600',
  },
]

/**
 * Section valeurs avec 3 piliers
 * Bio, local, solidaire avec animations modernes
 */
export function ValuesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Éléments décoratifs */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-green-200/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-200/10 rounded-full blur-3xl" />

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
            className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium mb-4"
          >
            💚 Nos valeurs
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Nos{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              engagements
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            AMAP TOGO s'engage pour une agriculture paysanne
            et une alimentation saine au Togo.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto"
        >
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              variants={cardVariants}
              custom={index}
            >
              <ValueCard {...value} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/** Carte pour une valeur avec animations au hover */
function ValueCard({ icon: Icon, title, description, color, index }: Value & { index: number }) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full border border-gray-100">
        {/* Icône animée */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`
            w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6
            bg-gradient-to-br ${color}
            rounded-2xl
            flex items-center justify-center
            shadow-lg shadow-green-500/30
            group-hover:shadow-xl group-hover:shadow-green-500/40
            transition-all duration-300
          `}
        >
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2} />
        </motion.div>

        {/* Titre */}
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Indicateur de numéro */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          className={`
            absolute -top-4 -right-4
            w-10 h-10 rounded-full
            bg-gradient-to-br ${color}
            text-white font-bold text-lg
            flex items-center justify-center
            shadow-lg
          `}
        >
          {index + 1}
        </motion.div>

        {/* Barre de progression décorative */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-b-2xl"
        />
      </div>
    </motion.div>
  )
}
