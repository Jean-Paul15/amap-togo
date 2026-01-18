// Page dashboard du compte client
// Resume des commandes et credits

import { createClientServer } from '@amap-togo/database/server'
import { Package, CreditCard, Clock } from 'lucide-react'
import { formatPrice } from '@amap-togo/utils'
import Link from 'next/link'

export const metadata = {
  title: 'Mon compte',
}

export default async function ComptePage() {
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

  // Recuperer les commandes recentes
  const { data: commandes } = await supabase
    .from('commandes')
    .select('id, numero, statut, montant_total, created_at')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const commandesRecentes = (commandes || []) as Array<{
    id: string
    numero: string
    statut: string
    montant_total: number
    created_at: string
  }>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-foreground">
        Bienvenue sur votre espace
      </h1>

      {/* Cartes resume */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Credit disponible */}
        <div className="p-6 bg-accent/50 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Credit disponible</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(profile?.solde_credit || 0)}
          </p>
        </div>

        {/* Nombre de commandes */}
        <div className="p-6 bg-accent/50 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Commandes</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {commandesRecentes.length}
          </p>
        </div>

        {/* Statut */}
        <div className="p-6 bg-accent/50 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">En cours</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {commandesRecentes.filter((c) => c.statut === 'en_attente' || c.statut === 'confirmee').length}
          </p>
        </div>
      </div>

      {/* Commandes recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Commandes recentes
          </h2>
          <Link
            href="/compte/commandes"
            className="text-sm text-primary hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {commandesRecentes.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            Aucune commande pour le moment
          </p>
        ) : (
          <div className="space-y-3">
            {commandesRecentes.map((commande) => (
              <div
                key={commande.id}
                className="flex items-center justify-between p-4 bg-background border border-border rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {commande.numero}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(commande.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatPrice(commande.montant_total)}
                  </p>
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${commande.statut === 'livree' ? 'bg-green-100 text-green-700' : ''}
                    ${commande.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${commande.statut === 'confirmee' ? 'bg-blue-100 text-blue-700' : ''}
                  `}>
                    {commande.statut.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
