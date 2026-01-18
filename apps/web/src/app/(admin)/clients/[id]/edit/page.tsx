// Page edition d'un client
// Formulaire compatible avec le systeme RBAC

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'
import { ArrowLeft, Save, User, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

interface Client {
  id: string
  email: string
  nom: string | null
  prenom: string | null
  telephone: string | null
  adresse: string | null
  quartier: string | null
  role_id: string | null
  actif: boolean
  created_at: string
}

interface Role {
  id: string
  nom: string
}

export default function EditClientPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [quartier, setQuartier] = useState('')
  const [roleId, setRoleId] = useState<string | null>(null)
  const [actif, setActif] = useState(true)

  // Verifie si l'utilisateur edite son propre profil
  const isEditingOwnProfile = currentUserId === clientId

  useEffect(() => {
    async function fetchData() {
      try {
        // Recupere l'utilisateur connecte
        const { data: { user } } = await supabaseClient.auth.getUser()
        if (user) {
          setCurrentUserId(user.id)
        }

        // Charger les roles disponibles
        const { data: rolesData } = await supabaseClient
          .from('roles')
          .select('id, nom')
          .eq('actif', true)
          .order('nom')
        
        setRoles(rolesData || [])

        // Recupere le client a editer
        const { data, error } = await supabaseClient
          .from('profils')
          .select('*')
          .eq('id', clientId)
          .single()

        if (error) throw error
        if (data) {
          setClient(data as Client)
          setNom(data.nom || '')
          setPrenom(data.prenom || '')
          setTelephone(data.telephone || '')
          setAdresse(data.adresse || '')
          setQuartier(data.quartier || '')
          setRoleId(data.role_id)
          setActif(data.actif)
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    if (clientId) {
      fetchData()
    }
  }, [clientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)
    try {
      // Construction des donnees de mise a jour
      // Exclut le role_id si l'utilisateur modifie son propre profil
      const updateData: Record<string, string | boolean | null> = {
        nom: nom.trim() || null,
        prenom: prenom.trim() || null,
        telephone: telephone.trim() || null,
        adresse: adresse.trim() || null,
        quartier: quartier.trim() || null,
        actif,
      }

      // N'autorise pas la modification du role pour son propre compte
      if (!isEditingOwnProfile && roleId) {
        updateData.role_id = roleId
      }

      const { error } = await supabaseClient
        .from('profils')
        .update(updateData)
        .eq('id', clientId)

      if (error) throw error
      toast.success('Client modifié avec succès')
      router.push('/clients')
      router.refresh()
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la modification')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-8 bg-gray-100 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Client introuvable</p>
        <Link href="/clients" className="text-green-600 hover:underline mt-2 inline-block">
          Retour aux clients
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/clients"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Modifier le client
          </h1>
          <p className="text-sm text-gray-500">{client.email}</p>
        </div>
      </div>

        <form onSubmit={handleSubmit} className="max-w-xl">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {client.prenom} {client.nom}
                </p>
                <p className="text-xs text-gray-500">
                  Inscrit le {new Date(client.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                  Prenom
                </label>
                <input
                  id="prenom"
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Prenom"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  id="nom"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Telephone
              </label>
              <input
                id="telephone"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Numero de telephone"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
            </div>

            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                id="adresse"
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Adresse complete"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
            </div>

            <div>
              <label htmlFor="quartier" className="block text-sm font-medium text-gray-700 mb-1">
                Quartier
              </label>
              <input
                id="quartier"
                type="text"
                value={quartier}
                onChange={(e) => setQuartier(e.target.value)}
                placeholder="Quartier"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
                {isEditingOwnProfile && (
                  <span className="ml-2 text-xs text-amber-600 font-normal">
                    (Vous ne pouvez pas modifier votre propre role)
                  </span>
                )}
              </label>
              <select
                id="role"
                value={roleId || ''}
                onChange={(e) => setRoleId(e.target.value || null)}
                disabled={isEditingOwnProfile}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">-- Selectionner un role --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nom}
                  </option>
                ))}
              </select>
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
                Compte actif
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer
                </>
              )}
            </button>
            <Link
              href="/clients"
              className="px-5 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
