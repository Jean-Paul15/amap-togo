// Page gestion des types de paniers
// CRUD complet pour paniers_types

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, ShoppingBag, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PanierType {
  id: string
  type: string
  nom: string
  prix: number
  description: string | null
  actif: boolean
}

const TYPES_PANIER = [
  { value: 'petit', label: 'Petit' },
  { value: 'grand', label: 'Grand' },
  { value: 'local', label: 'Local' },
]

export default function PaniersTypesPage() {
  const [types, setTypes] = useState<PanierType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Formulaire
  const [formData, setFormData] = useState({
    type: 'petit',
    nom: '',
    prix: '',
    description: '',
    actif: true,
  })

  useEffect(() => {
    fetchTypes()
  }, [])

  async function fetchTypes() {
    try {
      const { data, error } = await supabaseClient
        .from('paniers_types')
        .select('*')
        .order('nom')

      if (error) throw error
      setTypes((data || []) as PanierType[])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ type: 'petit', nom: '', prix: '', description: '', actif: true })
    setEditingId(null)
    setIsCreating(false)
  }

  const startEdit = (item: PanierType) => {
    setFormData({
      type: item.type,
      nom: item.nom,
      prix: String(item.prix),
      description: item.description || '',
      actif: item.actif,
    })
    setEditingId(item.id)
    setIsCreating(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nom || !formData.prix) return

    try {
      const data = {
        type: formData.type,
        nom: formData.nom,
        prix: parseInt(formData.prix),
        description: formData.description || null,
        actif: formData.actif,
      }

      if (editingId) {
        await supabaseClient.from('paniers_types').update(data).eq('id', editingId)
      } else {
        await supabaseClient.from('paniers_types').insert(data)
      }

      resetForm()
      fetchTypes()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce type de panier ?')) return
    try {
      await supabaseClient.from('paniers_types').delete().eq('id', id)
      fetchTypes()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Impossible de supprimer (paniers associes)')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Types de paniers</h1>
            <p className="text-sm text-gray-500">{types.length} types</p>
          </div>
          <button
            onClick={() => { setIsCreating(true); setEditingId(null) }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            Nouveau
          </button>
        </div>

        {/* Formulaire */}
        {(isCreating || editingId) && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  {TYPES_PANIER.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  placeholder="Panier Famille"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Prix (FCFA)</label>
                <input
                  type="number"
                  value={formData.prix}
                  onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  placeholder="5000"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  placeholder="Description..."
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.actif}
                  onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  className="rounded"
                />
                Actif
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={resetForm} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
                <button type="submit" className="flex items-center gap-1 px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg">
                  <Save className="w-4 h-4" />
                  {editingId ? 'Modifier' : 'Creer'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Liste */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />)}
            </div>
          ) : types.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Aucun type de panier</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Prix</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {types.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{item.nom}</span>
                      {item.description && (
                        <p className="text-xs text-gray-400">{item.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 capitalize">{item.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-green-600">{formatPrice(item.prix)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        item.actif ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      )}>
                        {item.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(item)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
  )
}
