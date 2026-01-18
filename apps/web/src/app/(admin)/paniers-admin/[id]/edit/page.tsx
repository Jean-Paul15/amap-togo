// Page edition d'un panier hebdomadaire existant
// Permet de modifier les dates, type et contenu

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'
import { ArrowLeft, Calendar, Save, Package, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

interface PanierType {
  id: string
  nom: string
  prix: number
}

interface Produit {
  id: string
  nom: string
  prix: number
  unite: string
}

interface PageProps {
  params: { id: string }
}

export default function EditPanierPage({ params }: PageProps) {
  const { id } = params
  const router = useRouter()
  const toast = useToast()

  const [panierTypes, setPanierTypes] = useState<PanierType[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Formulaire
  const [panierTypeId, setPanierTypeId] = useState('')
  const [semaineDebut, setSemaineDebut] = useState('')
  const [semaineFin, setSemaineFin] = useState('')
  const [actif, setActif] = useState(true)
  const [selectedProduits, setSelectedProduits] = useState<Record<string, number>>({})

  useEffect(() => {
    async function fetchData() {
      try {
        // Charger types et produits en parallele
        const [typesRes, produitsRes, panierRes] = await Promise.all([
          supabaseClient.from('paniers_types').select('id, nom, prix').eq('actif', true).order('nom'),
          supabaseClient.from('produits').select('id, nom, prix, unite').eq('actif', true).order('nom'),
          supabaseClient.from('paniers_semaine').select('*, paniers_contenu(produit_id, quantite)').eq('id', id).single(),
        ])

        if (typesRes.data) setPanierTypes(typesRes.data as PanierType[])
        if (produitsRes.data) setProduits(produitsRes.data as Produit[])

        if (panierRes.error || !panierRes.data) {
          setNotFound(true)
          return
        }

        const panier = panierRes.data
        setPanierTypeId(panier.panier_type_id)
        setSemaineDebut(panier.semaine_debut)
        setSemaineFin(panier.semaine_fin)
        setActif(panier.actif)

        // Charger le contenu existant
        const contenu: Record<string, number> = {}
        interface PanierContenu {
          produit_id: string
          quantite: number
        }
        panier.paniers_contenu?.forEach((item: PanierContenu) => {
          contenu[item.produit_id] = item.quantite
        })
        setSelectedProduits(contenu)
      } catch (error) {
        console.error('Erreur:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

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
    setSelectedProduits((prev) => ({ ...prev, [produitId]: qty }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!panierTypeId || !semaineDebut || !semaineFin) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setSaving(true)
    try {
      // Mettre a jour le panier
      const { error: updateError } = await supabaseClient
        .from('paniers_semaine')
        .update({
          panier_type_id: panierTypeId,
          semaine_debut: semaineDebut,
          semaine_fin: semaineFin,
          actif,
        })
        .eq('id', id)

      if (updateError) throw updateError

      // Supprimer l'ancien contenu
      await supabaseClient.from('paniers_contenu').delete().eq('panier_semaine_id', id)

      // Inserer le nouveau contenu
      const contenuItems = Object.entries(selectedProduits).map(([produitId, quantite]) => ({
        panier_semaine_id: id,
        produit_id: produitId,
        quantite,
      }))

      if (contenuItems.length > 0) {
        const { error: contenuError } = await supabaseClient.from('paniers_contenu').insert(contenuItems)
        if (contenuError) throw contenuError
      }

      toast.success('Panier modifié avec succès')
      router.push('/paniers-admin')
      router.refresh()
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la mise à jour du panier')
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Panier non trouve</p>
        <Link href="/paniers" className="text-green-600 hover:underline">
          Retour a la liste
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/paniers" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Modifier le panier</h1>
      </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Calendar className="w-5 h-5 text-green-600" />
              <h2 className="font-medium text-gray-900">Informations</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de panier *</label>
              <select
                value={panierTypeId}
                onChange={(e) => setPanierTypeId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
              >
                <option value="">Selectionner un type</option>
                {panierTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.nom} - {formatPrice(type.prix)}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Debut semaine *</label>
                <input
                  type="date"
                  value={semaineDebut}
                  onChange={(e) => setSemaineDebut(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fin semaine *</label>
                <input
                  type="date"
                  value={semaineFin}
                  onChange={(e) => setSemaineFin(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={actif} onChange={(e) => setActif(e.target.checked)} className="rounded" />
              Panier actif
            </label>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <h2 className="font-medium text-gray-900">Contenu</h2>
              </div>
              <span className="text-xs text-gray-500">{Object.keys(selectedProduits).length} produit(s)</span>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {produits.map((produit) => {
                const isSelected = !!selectedProduits[produit.id]
                return (
                  <div
                    key={produit.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                      isSelected ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleProduit(produit.id)}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{produit.nom}</p>
                      <p className="text-xs text-gray-500">{formatPrice(produit.prix)} / {produit.unite}</p>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => updateQuantite(produit.id, selectedProduits[produit.id] - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border rounded text-gray-600 hover:bg-gray-100"
                        >-</button>
                        <span className="w-8 text-center text-sm font-medium">{selectedProduits[produit.id]}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantite(produit.id, selectedProduits[produit.id] + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border rounded text-gray-600 hover:bg-gray-100"
                        >+</button>
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
