// Hook pour la gestion du formulaire produit
// Logique de creation / edition

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase'

interface Categorie {
  id: string
  nom: string
}

interface ProduitFormData {
  nom: string
  description: string
  categorie_id: string
  prix: string
  unite: string
  stock: string
  seuil_alerte: string
  actif: boolean
  disponible_semaine: boolean
  image_url: string
}

const INITIAL_FORM_DATA: ProduitFormData = {
  nom: '',
  description: '',
  categorie_id: '',
  prix: '',
  unite: 'kg',
  stock: '',
  seuil_alerte: '5',
  actif: true,
  disponible_semaine: true,
  image_url: '',
}

interface UseProduitFormOptions {
  produitId?: string
}

/**
 * Hook pour gerer le formulaire produit (creation et edition)
 */
export function useProduitForm(options: UseProduitFormOptions = {}) {
  const router = useRouter()
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!options.produitId)
  const [formData, setFormData] = useState<ProduitFormData>(INITIAL_FORM_DATA)

  const isEdit = !!options.produitId

  useEffect(() => {
    fetchCategories()
    if (options.produitId) {
      fetchProduit(options.produitId)
    }
  }, [options.produitId])

  async function fetchCategories() {
    const { data } = await supabaseClient
      .from('categories')
      .select('id, nom')
      .eq('actif', true)
      .order('nom')

    setCategories((data || []) as Categorie[])
  }

  async function fetchProduit(id: string) {
    try {
      const { data, error } = await supabaseClient
        .from('produits')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          nom: data.nom || '',
          description: data.description || '',
          categorie_id: data.categorie_id || '',
          prix: String(data.prix || ''),
          unite: data.unite || 'kg',
          stock: String(data.stock || ''),
          seuil_alerte: String(data.seuil_alerte || '5'),
          actif: data.actif ?? true,
          disponible_semaine: data.disponible_semaine ?? true,
          image_url: data.image_url || '',
        })
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  function generateSlug(nom: string): string {
    return nom
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function updateField<K extends keyof ProduitFormData>(
    field: K,
    value: ProduitFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent): Promise<boolean> {
    e.preventDefault()
    setLoading(true)

    try {
      const produitData = {
        nom: formData.nom,
        slug: generateSlug(formData.nom),
        description: formData.description || null,
        categorie_id: formData.categorie_id || null,
        prix: parseInt(formData.prix),
        unite: formData.unite,
        stock: parseInt(formData.stock),
        seuil_alerte: parseInt(formData.seuil_alerte),
        actif: formData.actif,
        disponible_semaine: formData.disponible_semaine,
        image_url: formData.image_url || null,
      }

      if (isEdit && options.produitId) {
        const { error } = await supabaseClient
          .from('produits')
          .update(produitData)
          .eq('id', options.produitId)
        if (error) throw error
      } else {
        const { error } = await supabaseClient.from('produits').insert(produitData)
        if (error) throw error
      }

      router.push('/produits-admin')
      router.refresh()
      return true
    } catch (error) {
      console.error('Erreur:', error)
      alert(isEdit ? 'Erreur lors de la modification' : 'Erreur lors de la creation')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    categories,
    loading,
    initialLoading,
    isEdit,
    updateField,
    handleSubmit,
  }
}
