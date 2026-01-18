// Page detail d'une commande
// Affiche les infos, articles et permet de changer le statut

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'
import { formatStatutPaiement } from '@amap-togo/utils'
import { useToast } from '@/components/ui/toast'
import { 
  ArrowLeft, 
  User,
  MapPin,
  Phone,
  CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandeDetail {
  id: string
  numero: string
  statut: string
  statut_paiement: string
  montant_total: number
  montant_paye: number
  adresse_livraison: string | null
  quartier_livraison: string | null
  telephone_livraison: string | null
  notes: string | null
  created_at: string
  client_id: string | null
  client_anonyme: { nom?: string; prenom?: string; telephone?: string } | null
  client: { nom: string; prenom: string; email: string; telephone: string } | null
  lignes: Array<{
    id: string
    quantite: number
    prix_unitaire: number
    prix_total: number
    produit: { nom: string; unite: string } | null
  }>
}

const statutActions = [
  { from: 'en_attente', to: 'confirmee', label: 'Confirmer', color: 'bg-blue-600' },
  { from: 'confirmee', to: 'preparee', label: 'Marquer préparée', color: 'bg-purple-600' },
  { from: 'preparee', to: 'livree', label: 'Marquer livrée', color: 'bg-green-600' },
]

export default function CommandeDetailPage() {
  const params = useParams()
  const toast = useToast()
  const [commande, setCommande] = useState<CommandeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const commandeId = params.id as string

  useEffect(() => {
    async function fetchCommande() {
      try {
        const { data, error } = await supabaseClient
          .from('commandes')
          .select(`
            *,
            client:client_id(nom, prenom, email, telephone),
            lignes:commandes_lignes(
              id, quantite, prix_unitaire, prix_total,
              produit:produit_id(nom, unite)
            )
          `)
          .eq('id', commandeId)
          .single()

        if (error) throw error
        
        // Transformer les donnees pour gerer le format Supabase
        const formattedData = {
          ...data,
          client: Array.isArray(data.client) ? data.client[0] || null : data.client,
          lignes: (data.lignes || []).map((ligne: { produit: unknown[] | unknown }) => ({
            ...ligne,
            produit: Array.isArray(ligne.produit) ? ligne.produit[0] || null : ligne.produit,
          })),
        } as CommandeDetail
        
        setCommande(formattedData)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    if (commandeId) {
      fetchCommande()
    }
  }, [commandeId])

  // Changer le statut
  const handleStatusChange = async (newStatus: string) => {
    if (!commande) return
    setUpdating(true)

    try {
      const { error } = await supabaseClient
        .from('commandes')
        .update({ statut: newStatus })
        .eq('id', commande.id)

      if (error) throw error
      setCommande({ ...commande, statut: newStatus })
      toast.success('Statut mis à jour')
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setUpdating(false)
    }
  }

  // Annuler la commande
  const handleCancel = async () => {
    if (!commande || !confirm('Annuler cette commande ?')) return
    setUpdating(true)

    try {
      const { error } = await supabaseClient
        .from('commandes')
        .update({ statut: 'annulee' })
        .eq('id', commande.id)

      if (error) throw error
      setCommande({ ...commande, statut: 'annulee' })
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setUpdating(false)
    }
  }

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  // Formater la date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
        <div className="p-4 sm:p-6">
          <p className="text-gray-500">Chargement...</p>
        </div>
    )
  }

  if (!commande) {
    return (
        <div className="p-4 sm:p-6">
          <p className="text-gray-500">Commande introuvable</p>
        </div>
    )
  }

  // Trouver l'action disponible
  const availableAction = statutActions.find((a) => a.from === commande.statut)

  return (
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/commandes"
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {commande.numero}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                {formatDate(commande.created_at)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 ml-9 sm:ml-0">
            {availableAction && commande.statut !== 'annulee' && (
              <button
                onClick={() => handleStatusChange(availableAction.to)}
                disabled={updating}
                className={cn(
                  'px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white rounded-lg transition-colors disabled:opacity-50',
                  availableAction.color
                )}
              >
                {availableAction.label}
              </button>
            )}
            {commande.statut === 'en_attente' && (
              <button
                onClick={handleCancel}
                disabled={updating}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Articles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Articles commandés
              </h2>
              <div className="divide-y divide-gray-100">
                {commande.lignes.map((ligne) => (
                  <div key={ligne.id} className="py-2.5 sm:py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {ligne.produit?.nom || 'Produit inconnu'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {ligne.quantite} x {formatPrice(ligne.prix_unitaire)}
                        {ligne.produit?.unite && ` / ${ligne.produit.unite}`}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base flex-shrink-0">
                      {formatPrice(ligne.prix_total)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 flex justify-between">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">Total</span>
                <span className="font-bold text-base sm:text-lg text-gray-900">
                  {formatPrice(commande.montant_total)}
                </span>
              </div>
            </div>

            {/* Notes */}
            {commande.notes && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Notes
                </h2>
                <p className="text-sm sm:text-base text-gray-600">{commande.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Client */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                Client
              </h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {commande.client?.prenom || commande.client_anonyme?.prenom || ''} {commande.client?.nom || commande.client_anonyme?.nom || 'Client anonyme'}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {commande.client?.telephone || commande.client_anonyme?.telephone || commande.telephone_livraison || '-'}
                </p>
              </div>
            </div>

            {/* Livraison */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                Livraison
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <p>{commande.quartier_livraison}</p>
                {commande.adresse_livraison && (
                  <p>{commande.adresse_livraison}</p>
                )}
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                Paiement
              </h2>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-500">Statut</span>
                  <span className={cn(
                    'px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full',
                    commande.statut_paiement === 'paye'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  )}>
                    {formatStatutPaiement(commande.statut_paiement)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-500">Payé</span>
                  <span className="text-sm sm:text-base font-medium">{formatPrice(commande.montant_paye)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-500">Reste</span>
                  <span className="text-sm sm:text-base font-medium">
                    {formatPrice(commande.montant_total - commande.montant_paye)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
