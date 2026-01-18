// Page liste des categories avec edition inline
// Gestion des categories de produits

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase'
import { Plus, Trash2, GripVertical, Layers, Check, X, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Categorie {
  id: string
  nom: string
  slug: string
  description: string | null
  ordre: number
  actif: boolean
}

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const { data, error } = await supabaseClient
        .from('categories')
        .select('*')
        .order('ordre')

      if (error) throw error
      setCategories((data || []) as Categorie[])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (nom: string) => {
    return nom
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    try {
      const { error } = await supabaseClient.from('categories').insert({
        nom: newName,
        slug: generateSlug(newName),
        ordre: categories.length,
      })
      if (error) throw error
      setNewName('')
      setIsCreating(false)
      fetchCategories()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette categorie ?')) return
    try {
      const { error } = await supabaseClient.from('categories').delete().eq('id', id)
      if (error) throw error
      fetchCategories()
    } catch {
      alert('Impossible de supprimer (produits associes)')
    }
  }

  const toggleActif = async (cat: Categorie) => {
    try {
      const { error } = await supabaseClient
        .from('categories')
        .update({ actif: !cat.actif })
        .eq('id', cat.id)
      if (error) throw error
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, actif: !c.actif } : c))
      )
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const startEdit = (cat: Categorie) => {
    setEditingId(cat.id)
    setEditValue(cat.nom)
  }

  const saveEdit = async () => {
    if (!editValue.trim() || !editingId) return
    try {
      const { error } = await supabaseClient
        .from('categories')
        .update({ nom: editValue, slug: generateSlug(editValue) })
        .eq('id', editingId)
      if (error) throw error
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, nom: editValue, slug: generateSlug(editValue) } : c
        )
      )
      setEditingId(null)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header responsive */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">
              Catégories
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              {categories.length} catégories au total
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-green-700 transition-all shadow-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Nouvelle catégorie
          </button>
        </div>

        {/* Formulaire creation rapide */}
        {isCreating && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 animate-scale-in">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom de la catégorie"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                autoFocus
              />
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleCreate}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-green-700 transition-all shadow-sm"
                >
                  Créer
                </button>
                <button
                  onClick={() => { setIsCreating(false); setNewName('') }}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste responsive */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="space-y-3 p-4 sm:p-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 sm:h-14 bg-gray-50 rounded-lg sm:rounded-xl animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 sm:p-16 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">Aucune catégorie</p>
              <p className="text-xs text-gray-400 mt-1">
                Créez votre première catégorie
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="group flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400 group-hover:bg-gray-200 transition-colors flex-shrink-0">
                      <GripVertical className="w-4 h-4 cursor-grab" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {editingId === cat.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit()
                              if (e.key === 'Escape') cancelEdit()
                            }}
                            className="px-2 py-1 text-sm font-semibold border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-[200px]"
                            autoFocus
                            aria-label="Nom de la categorie"
                            placeholder="Nom de la categorie"
                          />
                          <button
                            onClick={saveEdit}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            aria-label="Enregistrer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                            aria-label="Annuler"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <p
                          onClick={() => startEdit(cat)}
                          className={cn(
                            'text-sm font-semibold cursor-pointer hover:text-green-600 truncate',
                            cat.actif ? 'text-gray-900' : 'text-gray-400'
                          )}
                          title="Cliquez pour modifier"
                        >
                          {cat.nom}
                        </p>
                      )}
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">
                        /{cat.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <button
                      onClick={() => toggleActif(cat)}
                      className={cn(
                        'px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full transition-all',
                        cat.actif
                          ? 'bg-green-50 text-green-600 hover:bg-green-100 ring-1 ring-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      )}
                    >
                      {cat.actif ? 'Actif' : 'Inactif'}
                    </button>
                    <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        aria-label="Modifier la catégorie"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Supprimer la catégorie"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
  )
}
