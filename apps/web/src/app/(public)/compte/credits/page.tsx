// Page des credits du client

import { createClientServer } from '@amap-togo/database/server'
import { formatPrice, formatStatutPaiement } from '@amap-togo/utils'
import { CreditCard, Plus, Minus } from 'lucide-react'

export const metadata = {
  title: 'Mes credits',
}

export default async function CreditsPage() {
  const supabase = await createClientServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Recuperer le profil avec credit
  const { data: profileData } = await supabase
    .from('profils')
    .select('solde_credit')
    .eq('id', user.id)
    .single()

  const profile = profileData as { solde_credit: number } | null

  // Recuperer l'historique des paiements
  const { data } = await supabase
    .from('paiements')
    .select('*, commande:commandes(numero)')
    .order('created_at', { ascending: false })

  // Filtrer par user via commandes
  const { data: userCommandes } = await supabase
    .from('commandes')
    .select('id')
    .eq('client_id', user.id)

  const commandeIds = (userCommandes || []).map((c: { id: string }) => c.id)

  const paiements = (data || []).filter((p: { commande_id: string }) =>
    commandeIds.includes(p.commande_id)
  ) as Array<{
    id: string
    montant: number
    mode: string
    statut: string
    created_at: string
    commande: { numero: string } | null
  }>

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Mes credits
      </h1>

      {/* Solde actuel */}
      <div className="p-8 bg-primary/5 border border-primary/20 rounded-xl mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Solde disponible</p>
            <p className="text-3xl font-bold text-foreground">
              {formatPrice(profile?.solde_credit || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Historique */}
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Historique des transactions
      </h2>

      {paiements.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground">
            Aucune transaction pour le moment
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paiements.map((paiement) => (
            <div
              key={paiement.id}
              className="flex items-center justify-between p-4 bg-background border border-border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${paiement.statut === 'paye' ? 'bg-green-100' : 'bg-yellow-100'}
                `}>
                  {paiement.statut === 'paye' ? (
                    <Minus className="w-4 h-4 text-green-600" />
                  ) : (
                    <Plus className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {paiement.commande?.numero || 'Credit'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(paiement.created_at).toLocaleDateString('fr-FR')} - {paiement.mode}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  paiement.statut === 'paye' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  -{formatPrice(paiement.montant)}
                </p>
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${paiement.statut === 'paye' ? 'bg-green-100 text-green-700' : ''}
                  ${paiement.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-700' : ''}
                `}>
                  {formatStatutPaiement(paiement.statut)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
