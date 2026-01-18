// Page liste des commandes du client

import { createClientServer } from '@amap-togo/database/server'
import { formatPrice, formatStatut } from '@amap-togo/utils'

export const metadata = {
  title: 'Mes commandes',
}

export default async function CommandesPage() {
  const supabase = await createClientServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Recuperer toutes les commandes
  const { data } = await supabase
    .from('commandes')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const commandes = (data || []) as Array<{
    id: string
    numero: string
    statut: string
    montant_total: number
    created_at: string
    date_livraison_souhaitee: string | null
  }>

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Mes commandes
      </h1>

      {commandes.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground">
            Vous n'avez pas encore passe de commande
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {commandes.map((commande) => (
            <div
              key={commande.id}
              className="p-6 bg-background border border-border rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {commande.numero}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Passee le {new Date(commande.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {commande.date_livraison_souhaitee && (
                    <p className="text-sm text-muted-foreground">
                      Livraison souhaitee : {new Date(commande.date_livraison_souhaitee).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className={`
                    text-sm px-3 py-1 rounded-full font-medium
                    ${commande.statut === 'livree' ? 'bg-green-100 text-green-700' : ''}
                    ${commande.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${commande.statut === 'confirmee' ? 'bg-blue-100 text-blue-700' : ''}
                    ${commande.statut === 'annulee' ? 'bg-red-100 text-red-700' : ''}
                  `}>
                    {formatStatut(commande.statut)}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {formatPrice(commande.montant_total)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
