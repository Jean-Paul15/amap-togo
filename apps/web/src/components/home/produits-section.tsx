// Section produits de la semaine
// Affiche les produits disponibles cette semaine (SSR) avec animations

'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import type { Produit } from '@amap-togo/database'
import { ProductCard } from '@/components/produits/product-card'
import { useCartStore } from '@/stores/cart-store'

interface ProduitsSectionProps {
  produits: Produit[]
}

/**
 * Section des produits de la semaine
 * Reçoit les produits pré-chargés côté serveur
 * Animations au scroll pour engagement visuel
 */
export function ProduitsSection({ produits }: ProduitsSectionProps) {
  const addItem = useCartStore((state) => state.addItem)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const handleAddToCart = (produit: Produit) => {
    addItem({
      id: produit.id,
      type: 'produit',
      nom: produit.nom,
      prix: produit.prix,
      unite: produit.unite,
      imageUrl: produit.image_url || undefined,
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-green-50/30 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* En-tête avec animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span>Fraîcheur garantie</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Produits de la semaine
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection de produits frais disponibles cette semaine.
          </p>
        </motion.div>

        {/* Grille de produits avec animations */}
        {produits.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
          >
            {produits.slice(0, 8).map((produit) => (
              <motion.div
                key={produit.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard
                  produit={produit}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            className="text-center text-muted-foreground py-12"
          >
            Aucun produit disponible pour le moment.
          </motion.p>
        )}

        {/* Bouton CTA avec animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-14 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/produits"
              className="
                inline-flex items-center gap-2
                px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl
                bg-gradient-to-r from-green-500 to-emerald-600
                text-white
                font-semibold text-sm sm:text-base
                hover:from-green-600 hover:to-emerald-700
                transition-all duration-300
                shadow-lg shadow-green-500/30
              "
            >
              Voir tous les produits
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
