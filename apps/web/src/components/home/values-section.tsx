// Section des valeurs AMAP
// Présentation des engagements bio, local, solidaire avec animations

'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { Leaf, MapPin, Users, Heart } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

/** Valeur avec icône et description */
interface Value {
  icon: typeof Leaf
  title: string
  description: string
  color: string
  image?: string
}

const values: Value[] = [
  {
    icon: Leaf,
    title: 'Agriculture biologique',
    description:
      'Nos produits sont cultivés sans pesticides ni engrais chimiques, ' +
      'dans le respect de la terre et de votre santé.',
    color: 'from-green-500 to-emerald-600',
    // image: '/images/gallery/visuel-2.jpg'
  },
  {
    icon: MapPin,
    title: 'Circuit court',
    description:
      'Du producteur à votre table, sans intermédiaire. ' +
      'Fraîcheur garantie et prix justes pour les agriculteurs.',
    color: 'from-blue-500 to-cyan-600',
    // image: '/images/gallery/visuel-3.jpg'
  },
  {
    icon: Users,
    title: 'Économie solidaire',
    description:
      'En choisissant AMAP, vous soutenez directement les paysans togolais ' +
      'et participez à une économie locale et durable.',
    color: 'from-orange-500 to-red-600',
    // image: '/images/gallery/visuel-4.jpg'
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
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 relative overflow-hidden bg-[#0a1f12]">
      {/* Éléments décoratifs */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-yellow-500/5 rounded-full blur-[100px]" />

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
            <Heart className="w-4 h-4" strokeWidth={2.5} fill="currentColor" />
            <span>Nos valeurs</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Nos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              engagements
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
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
function ValueCard({ icon: Icon, title, description, color, index, image }: Value & { index: number }) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative group h-full"
    >
      <div className="relative text-center bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 h-full overflow-hidden flex flex-col items-center">

        {/* Image de fond subtile ou intégrée */}
        {image && (
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
        )}

        {/* Icône animée - Added z-10 to keep it above image */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`
            relative z-10
            w-16 h-16 sm:w-20 sm:h-20 mb-6
            bg-gradient-to-br from-white/10 to-white/5
            rounded-2xl border border-white/10
            flex items-center justify-center
            shadow-lg
            group-hover:shadow-green-500/20
            transition-all duration-300
          `}
        >
          {/* Si image dispo, on peut aussi la mettre en petit rond ou garder l'icone */}
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
        </motion.div>


        {/* Titre */}
        <h3 className="relative z-10 text-xl sm:text-2xl font-bold text-white mb-4">
          {title}
        </h3>

        {/* Description */}
        <p className="relative z-10 text-sm sm:text-base text-gray-400 leading-relaxed">
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
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-b-2xl opacity-50"
        />
      </div>
    </motion.div>
  )
}
