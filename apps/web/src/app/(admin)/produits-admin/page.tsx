// Page liste des produits avec edition inline
// Modifier nom, categorie, prix, stock et statut directement

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'
import { Plus, Search, Edit, AlertTriangle, Package, Trash2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InlineEditCell } from '@/components/admin/produits/inline-edit-cell'
import { InlineImageEdit } from '@/components/admin/produits/inline-image-edit'
import { StatusToggle } from '@/components/admin/produits/status-toggle'
import { ExportProduitDialog } from '@/components/admin/produits/export-dialog'
import { useToast } from '@/components/ui/toast'

interface Categorie {
  id: string
  nom: string
}

interface Produit {
  id: string
  nom: string
  slug: string
  prix: number
  unite: string
  stock: number
  seuil_alerte: number
  actif: boolean
  en_vedette: boolean
  image_url: string | null
  categorie_id: string | null
  categorie: { nom: string } | null
}

export default function ProduitsListPage() {
  const toast = useToast()
  const [produits, setProduits] = useState<Produit[]>([])
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [produitsRes, categoriesRes] = await Promise.all([
          supabaseClient
            .from('produits')
            .select('*, categorie:categories(nom)')
            .order('nom'),
          supabaseClient
            .from('categories')
            .select('id, nom')
            .eq('actif', true)
            .order('nom'),
        ])

        if (produitsRes.error) throw produitsRes.error
        setProduits((produitsRes.data || []) as Produit[])
        setCategories((categoriesRes.data || []) as Categorie[])
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProduits = produits.filter((p) =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  )

  // Mise a jour d'un champ produit
  const updateProduit = async (
    id: string,
    field: string,
    value: string | number | boolean
  ): Promise<boolean> => {
    try {
      const { error } = await supabaseClient
        .from('produits')
        .update({ [field]: value })
        .eq('id', id)

      if (error) throw error

      // Mise a jour locale
      setProduits((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p
          const updated = { ...p, [field]: value }
          // Mettre a jour le nom de categorie si on change categorie_id
          if (field === 'categorie_id') {
            const cat = categories.find((c) => c.id === value)
            updated.categorie = cat ? { nom: cat.nom } : null
          }
          return updated
        })
      )
      toast.success('Produit modifié')
      return true
    } catch (error) {
      console.error('Erreur mise a jour:', error)
      toast.error('Erreur lors de la mise à jour')
      return false
    }
  }

  /** Met a jour l'image d'un produit localement */
  const updateImage = (id: string, newUrl: string) => {
    setProduits((prev) =>
      prev.map((p) => (p.id === id ? { ...p, image_url: newUrl } : p))
    )
    toast.success('Image modifiée')
  }

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Supprimer le produit "${nom}" ?`)) return
    try {
      const { error } = await supabaseClient.from('produits').delete().eq('id', id)
      if (error) throw error
      setProduits((prev) => prev.filter((p) => p.id !== id))
      toast.success('Produit supprimé')
    } catch {
      toast.error('Impossible de supprimer (produit utilisé dans des commandes)')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.nom }))

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">
            Produits
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {produits.length} produits - Cliquez sur une valeur pour la modifier
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setExportDialogOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-blue-700 transition-all shadow-sm w-full sm:w-auto"
          >
            <FileText className="w-4 h-4" />
            Exporter Excel
          </button>
          <Link
            href="/produits-admin/create"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-green-700 transition-all shadow-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Nouveau produit
          </Link>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 sm:max-w-md"
        />
      </div>

      {/* Table desktop / Cards mobile */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table desktop uniquement */}
        <table className="w-full hidden md:table">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                Produit
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                Catégorie
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                Prix
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                Stock
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                Vedette
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                Statut
              </th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-4 py-3">
                    <div className="h-12 bg-gray-50 rounded-lg animate-pulse" />
                  </td>
                </tr>
              ))
            ) : filteredProduits.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Aucun produit trouvé</p>
                </td>
              </tr>
            ) : (
              filteredProduits.map((produit) => (
                <tr key={produit.id} className="group hover:bg-gray-50/50">
                  {/* Nom avec image editable */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <InlineImageEdit
                        imageUrl={produit.image_url}
                        productName={produit.nom}
                        productId={produit.id}
                        onUpdate={(url) => updateImage(produit.id, url)}
                        size="sm"
                      />
                      <InlineEditCell
                        value={produit.nom}
                        onSave={(v) => updateProduit(produit.id, 'nom', v)}
                        className="font-semibold text-gray-900 text-sm"
                      />
                    </div>
                  </td>

                  {/* Categorie */}
                  <td className="px-4 py-3">
                    <InlineEditCell
                      value={produit.categorie_id || ''}
                      onSave={(v) => updateProduit(produit.id, 'categorie_id', v)}
                      type="select"
                      options={[{ value: '', label: 'Non classé' }, ...categoryOptions]}
                      formatDisplay={() => produit.categorie?.nom || 'Non classé'}
                      className="text-xs font-medium bg-gray-100 text-gray-600 rounded-lg"
                    />
                  </td>

                  {/* Prix */}
                  <td className="px-4 py-3">
                    <InlineEditCell
                      value={produit.prix}
                      onSave={(v) => updateProduit(produit.id, 'prix', v)}
                      type="number"
                      formatDisplay={(v) => formatPrice(Number(v))}
                      className="font-semibold text-gray-900 text-sm"
                    />
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <InlineEditCell
                        value={produit.stock}
                        onSave={(v) => updateProduit(produit.id, 'stock', v)}
                        type="number"
                        className={cn(
                          'font-semibold tabular-nums text-sm',
                          produit.stock <= produit.seuil_alerte
                            ? 'text-amber-600'
                            : 'text-gray-900'
                        )}
                      />
                      {produit.stock <= produit.seuil_alerte && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span className="text-[10px] font-medium text-amber-600">
                            Faible
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Statut */}
                  <td className="px-4 py-3">
                    <StatusToggle
                      actif={produit.actif}
                      onToggle={async () => {
                        return await updateProduit(produit.id, 'actif', !produit.actif)
                      }}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/produits-admin/${produit.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(produit.id, produit.nom)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Vue mobile: Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4">
                <div className="h-20 bg-gray-50 rounded-lg animate-pulse" />
              </div>
            ))
          ) : filteredProduits.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Aucun produit trouvé</p>
            </div>
          ) : (
            filteredProduits.map((produit) => (
              <div key={produit.id} className="p-4">
                <div className="flex items-start gap-3">
                  {/* Image editable */}
                  <InlineImageEdit
                    imageUrl={produit.image_url}
                    productName={produit.nom}
                    productId={produit.id}
                    onUpdate={(url) => updateImage(produit.id, url)}
                    size="md"
                  />
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {produit.nom}
                      </h3>
                      <StatusToggle
                        actif={produit.actif}
                        onToggle={async () => {
                          return await updateProduit(produit.id, 'actif', !produit.actif)
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {produit.categorie?.nom || 'Non classé'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(produit.prix)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-medium',
                          produit.stock <= produit.seuil_alerte
                            ? 'text-amber-600'
                            : 'text-gray-500'
                        )}>
                          Stock: {produit.stock}
                        </span>
                        {produit.stock <= produit.seuil_alerte && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/produits-admin/${produit.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(produit.id, produit.nom)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        aria-label={`Supprimer ${produit.nom}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialog export */}
      <ExportProduitDialog
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        totalProduits={produits.length}
      />
    </div>
  )
}
