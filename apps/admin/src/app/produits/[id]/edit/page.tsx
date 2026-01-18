// Page edition d'un produit
// Formulaire pour modifier un produit existant

'use client'

export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import { AdminLayout } from '@/components/layout'
import { ProduitForm } from '@/components/produits'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

/**
 * Page d'edition d'un produit
 */
export default function EditProduitPage() {
  const params = useParams()
  const produitId = params.id as string

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/produits"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            Modifier le produit
          </h1>
        </div>

        {/* Formulaire */}
        <ProduitForm produitId={produitId} />
      </div>
    </AdminLayout>
  )
}
