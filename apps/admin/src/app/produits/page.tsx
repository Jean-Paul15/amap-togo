// Page liste des produits avec edition inline
// Modifier nom, categorie, prix, stock et statut directement

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/layout'
import { supabaseClient } from '@/lib/supabase'
import { Plus, Search, Edit, AlertTriangle, Package, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InlineEditCell } from '@/components/produits/inline-edit-cell'
import { StatusToggle } from '@/components/produits/status-toggle'

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
  image_url: string | null
  categorie_id: string | null
  categorie: { nom: string } | null
}

export default function ProduitsListPage() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

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
      return true
    } catch (error) {
      console.error('Erreur mise a jour:', error)
      return false
    }
  }

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Supprimer le produit "${nom}" ?`)) return
    try {
      const { error } = await supabaseClient.from('produits').delete().eq('id', id)
      if (error) throw error
      setProduits((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Impossible de supprimer (produit utilise dans des commandes)')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.nom }))

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Produits
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {produits.length} produits - Cliquez sur une valeur pour la modifier
            </p>
          </div>
          <Link
            href="/produits/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau produit
          </Link>
        </div>

        {/* Recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Produit
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Categorie
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Prix
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Stock
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Statut
                </th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-12 bg-gray-50 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredProduits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Aucun produit trouve</p>
                  </td>
                </tr>
              ) : (
                filteredProduits.map((produit) => (
                  <tr key={produit.id} className="group hover:bg-gray-50/50">
                    {/* Nom */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {produit.image_url ? (
                            <img
                              src={produit.image_url}
                              alt={produit.nom}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <InlineEditCell
                          value={produit.nom}
                          onSave={(v) => updateProduit(produit.id, 'nom', v)}
                          className="font-semibold text-gray-900"
                        />
                      </div>
                    </td>

                    {/* Categorie */}
                    <td className="px-5 py-4">
                      <InlineEditCell
                        value={produit.categorie_id || ''}
                        onSave={(v) => updateProduit(produit.id, 'categorie_id', v)}
                        type="select"
                        options={[{ value: '', label: 'Non classe' }, ...categoryOptions]}
                        formatDisplay={() => produit.categorie?.nom || 'Non classe'}
                        className="text-xs font-medium bg-gray-100 text-gray-600 rounded-lg"
                      />
                    </td>

                    {/* Prix */}
                    <td className="px-5 py-4">
                      <InlineEditCell
                        value={produit.prix}
                        onSave={(v) => updateProduit(produit.id, 'prix', v)}
                        type="number"
                        formatDisplay={(v) => formatPrice(Number(v))}
                        className="font-semibold text-gray-900"
                      />
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <InlineEditCell
                          value={produit.stock}
                          onSave={(v) => updateProduit(produit.id, 'stock', v)}
                          type="number"
                          className={cn(
                            'font-semibold tabular-nums',
                            produit.stock <= produit.seuil_alerte
                              ? 'text-amber-600'
                              : 'text-gray-900'
                          )}
                        />
                        {produit.stock <= produit.seuil_alerte && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            <span className="text-[10px] font-medium text-amber-600">
                              Faible
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="px-5 py-4">
                      <StatusToggle
                        actif={produit.actif}
                        onToggle={async () => {
                          return await updateProduit(produit.id, 'actif', !produit.actif)
                        }}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/produits/${produit.id}/edit`}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(produit.id, produit.nom)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
        </div>
      </div>
    </AdminLayout>
  )
}
