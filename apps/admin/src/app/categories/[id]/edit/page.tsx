// Page edition d'une categorie
// Formulaire pour modifier une categorie existante

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/layout'
import { supabaseClient } from '@/lib/supabase'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'

interface Categorie {
  id: string
  nom: string
  slug: string
  description: string | null
  ordre: number
  actif: boolean
}

export default function EditCategoriePage() {
  const params = useParams()
  const router = useRouter()
  const categorieId = params.id as string

  const [categorie, setCategorie] = useState<Categorie | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [actif, setActif] = useState(true)

  useEffect(() => {
    async function fetchCategorie() {
      try {
        const { data, error } = await supabaseClient
          .from('categories')
          .select('*')
          .eq('id', categorieId)
          .single()

        if (error) throw error
        if (data) {
          setCategorie(data as Categorie)
          setNom(data.nom)
          setDescription(data.description || '')
          setActif(data.actif)
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    if (categorieId) {
      fetchCategorie()
    }
  }, [categorieId])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nom.trim()) return

    setSaving(true)
    try {
      const { error } = await supabaseClient
        .from('categories')
        .update({
          nom: nom.trim(),
          slug: generateSlug(nom),
          description: description.trim() || null,
          actif,
        })
        .eq('id', categorieId)

      if (error) throw error
      router.push('/categories')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la modification')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer cette categorie ?')) return

    try {
      const { error } = await supabaseClient
        .from('categories')
        .delete()
        .eq('id', categorieId)

      if (error) throw error
      router.push('/categories')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Impossible de supprimer (produits associes)')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-5">
          <div className="h-8 bg-gray-100 rounded w-48 animate-pulse" />
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!categorie) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Categorie introuvable</p>
          <Link href="/categories" className="text-green-600 hover:underline mt-2 inline-block">
            Retour aux categories
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/categories"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Modifier la categorie
            </h1>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="actif"
                checked={actif}
                onChange={(e) => setActif(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="actif" className="text-sm text-gray-700">
                Categorie active
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link
              href="/categories"
              className="px-5 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
