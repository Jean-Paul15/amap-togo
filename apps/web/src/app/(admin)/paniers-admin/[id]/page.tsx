// Page detail d'un panier hebdomadaire
// Affiche les informations et le contenu du panier

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'
import { ArrowLeft, Calendar, Package, Edit, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Contenu {
  id: string
  quantite: number
  produit: { nom: string; prix: number; unite: string }
}

interface PanierDetail {
  id: string
  semaine_debut: string
  semaine_fin: string
  actif: boolean
  created_at: string
  panier_type: { nom: string; prix: number; type: string } | null
  paniers_contenu: Contenu[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PanierDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [panier, setPanier] = useState<PanierDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchPanier() {
      try {
        const { data, error } = await supabaseClient
          .from('paniers_semaine')
          .select(`
            *,
            panier_type:paniers_types(nom, prix, type),
            paniers_contenu(id, quantite, produit:produits(nom, prix, unite))
          `)
          .eq('id', id)
          .single()

        if (error) throw error
        setPanier(data as PanierDetail)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPanier()
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Supprimer ce panier et son contenu ?')) return

    setDeleting(true)
    try {
      // Supprimer le contenu d'abord
      await supabaseClient.from('paniers_contenu').delete().eq('panier_semaine_id', id)
      // Puis le panier
      await supabaseClient.from('paniers_semaine').delete().eq('id', id)
      router.push('/paniers')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Impossible de supprimer ce panier')
    } finally {
      setDeleting(false)
    }
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!panier) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Panier non trouve</p>
        <Link href="/paniers" className="text-green-600 hover:underline">Retour</Link>
      </div>
    )
  }

  const totalContenu = panier.paniers_contenu?.reduce((sum, item) => {
    return sum + (item.produit?.prix || 0) * item.quantite
  }, 0) || 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/paniers" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{panier.panier_type?.nom || 'Panier'}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {formatDate(panier.semaine_debut)} - {formatDate(panier.semaine_fin)}
            </div>
          </div>
        </div>
          <div className="flex gap-2">
            <Link
              href={`/paniers/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Infos */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Informations</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <span className="font-medium capitalize">{panier.panier_type?.type || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Prix</span>
                <span className="font-medium text-green-600">{panier.panier_type ? formatPrice(panier.panier_type.prix) : '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Statut</span>
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  panier.actif ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                )}>
                  {panier.actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Produits</span>
                <span className="font-medium">{panier.paniers_contenu?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <h2 className="text-sm font-medium text-gray-900">Contenu du panier</h2>
              </div>
              <span className="text-sm text-gray-500">Valeur: {formatPrice(totalContenu)}</span>
            </div>

            {panier.paniers_contenu?.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">Aucun produit</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {panier.paniers_contenu?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.produit?.nom}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantite} x {formatPrice(item.produit?.prix || 0)} / {item.produit?.unite}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formatPrice((item.produit?.prix || 0) * item.quantite)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  )
}
