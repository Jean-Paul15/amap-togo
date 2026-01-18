// Page creation d'un nouveau panier hebdomadaire
// Formulaire pour definir un panier de la semaine

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'
import { ArrowLeft, Calendar, Save, Package } from 'lucide-react'

interface PanierType {
  id: string
  nom: string
  prix: number
  description: string | null
}

interface Produit {
  id: string
  nom: string
  prix: number
  unite: string
}

export default function CreatePanierPage() {
  const router = useRouter()

  const [panierTypes, setPanierTypes] = useState<PanierType[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Formulaire
  const [panierTypeId, setPanierTypeId] = useState('')
  const [semaineDebut, setSemaineDebut] = useState('')
  const [semaineFin, setSemaineFin] = useState('')
  const [selectedProduits, setSelectedProduits] = useState<Record<string, number>>({})

  useEffect(() => {
    async function fetchData() {
      try {
        const [typesRes, produitsRes] = await Promise.all([
          supabaseClient
            .from('paniers_types')
            .select('id, nom, prix, description')
            .eq('actif', true)
            .order('nom'),
          supabaseClient
            .from('produits')
            .select('id, nom, prix, unite')
            .eq('actif', true)
            .order('nom'),
        ])

        if (typesRes.data) setPanierTypes(typesRes.data as PanierType[])
        if (produitsRes.data) setProduits(produitsRes.data as Produit[])
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Definir la semaine courante par defaut
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    setSemaineDebut(monday.toISOString().split('T')[0])
    setSemaineFin(sunday.toISOString().split('T')[0])
  }, [])

  const toggleProduit = (produitId: string) => {
    setSelectedProduits((prev) => {
      const copy = { ...prev }
      if (copy[produitId]) {
        delete copy[produitId]
      } else {
        copy[produitId] = 1
      }
      return copy
    })
  }

  const updateQuantite = (produitId: string, qty: number) => {
    if (qty < 1) return
    setSelectedProduits((prev) => ({
      ...prev,
      [produitId]: qty,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!panierTypeId || !semaineDebut || !semaineFin) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setSaving(true)
    try {
      // Creer le panier semaine
      const { data: panier, error: panierError } = await supabaseClient
        .from('paniers_semaine')
        .insert({
          panier_type_id: panierTypeId,
          semaine_debut: semaineDebut,
          semaine_fin: semaineFin,
          actif: true,
        })
        .select()
        .single()

      if (panierError) throw panierError

      // Ajouter les produits au contenu
      const contenuItems = Object.entries(selectedProduits).map(([produitId, quantite]) => ({
        panier_semaine_id: panier.id,
        produit_id: produitId,
        quantite,
      }))

      if (contenuItems.length > 0) {
        const { error: contenuError } = await supabaseClient
          .from('paniers_contenu')
          .insert(contenuItems)

        if (contenuError) throw contenuError
      }

      router.push('/paniers')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la creation du panier')
    } finally {
      setSaving(false)
    }
  }

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-8 bg-gray-100 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/paniers"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">
          Nouveau panier
        </h1>
      </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-5">
          {/* Informations du panier */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Calendar className="w-5 h-5 text-green-600" />
              <h2 className="font-medium text-gray-900">Informations</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de panier *
              </label>
              <select
                value={panierTypeId}
                onChange={(e) => setPanierTypeId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              >
                <option value="">Selectionner un type</option>
                {panierTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.nom} - {formatPrice(type.prix)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Debut semaine *
                </label>
                <input
                  type="date"
                  value={semaineDebut}
                  onChange={(e) => setSemaineDebut(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fin semaine *
                </label>
                <input
                  type="date"
                  value={semaineFin}
                  onChange={(e) => setSemaineFin(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Creation...' : 'Creer le panier'}
              </button>
            </div>
          </div>

          {/* Selection des produits */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <h2 className="font-medium text-gray-900">Contenu du panier</h2>
              </div>
              <span className="text-xs text-gray-500">
                {Object.keys(selectedProduits).length} produit(s)
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {produits.map((produit) => {
                const isSelected = !!selectedProduits[produit.id]
                return (
                  <div
                    key={produit.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleProduit(produit.id)}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{produit.nom}</p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(produit.prix)} / {produit.unite}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => updateQuantite(produit.id, selectedProduits[produit.id] - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {selectedProduits[produit.id]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantite(produit.id, selectedProduits[produit.id] + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </form>
    </div>
  )
}
