// Page edition d'un produit
// Formulaire pour modifier un produit existant

'use client'

export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import { ProduitForm } from '@/components/admin/produits'
import { ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

/**
 * Page d'edition d'un produit avec animations
 */
export default function EditProduitPage() {
  const params = useParams()
  const produitId = params.id as string

  return (
    <motion.div 
      className="space-y-4 sm:space-y-5 px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header avec animation */}
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link
          href="/produits-admin"
          className="p-2 hover:bg-gray-100 rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Modifier le produit
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Mettez à jour les informations du produit
            </p>
          </div>
        </div>
      </motion.div>

      {/* Formulaire */}
      <ProduitForm produitId={produitId} />
    </motion.div>
  )
}
