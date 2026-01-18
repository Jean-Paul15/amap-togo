// Page creation d'un produit
// Formulaire pour ajouter un nouveau produit

'use client'

export const dynamic = 'force-dynamic'

import { AdminLayout } from '@/components/layout'
import { ProduitForm } from '@/components/produits'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

/**
 * Page de creation d'un nouveau produit
 */
export default function CreateProduitPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/produits"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau produit</h1>
        </div>

        {/* Formulaire */}
        <ProduitForm />
      </div>
    </AdminLayout>
  )
}
