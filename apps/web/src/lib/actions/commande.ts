// Server Actions pour les commandes
// Creation, validation et gestion des commandes

'use server'

import { z } from 'zod'
import { createClientServer } from '@amap-togo/database/server'
import type { PaymentMethod } from '@amap-togo/database'

// Schema de validation pour les items du panier
const cartItemSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['produit', 'panier']),
  quantite: z.number().int().positive(),
  prix: z.number().int().positive(),
})

// Schema de validation pour la commande
const createOrderSchema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  telephone: z.string().min(8, 'Telephone invalide'),
  quartier: z.string().min(2, 'Quartier requis'),
  adresse: z.string().optional(),
  notes: z.string().optional(),
  methode_paiement: z.enum(['especes', 'mixx', 'flooz', 'credit']),
  items: z.array(cartItemSchema).min(1, 'Panier vide'),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

interface CreateOrderResult {
  success: boolean
  numero?: string
  error?: string
}

/**
 * Cree une nouvelle commande en base de donnees
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  try {
    // Validation des donnees
    const data = createOrderSchema.parse(input)
    
    const supabase = await createClientServer()
    
    // Verifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Vous devez etre connecte' }
    }

    // Calculer le montant total
    const montantTotal = data.items.reduce(
      (sum, item) => sum + item.prix * item.quantite,
      0
    )

    // Separer produits et paniers
    const produits = data.items.filter((i) => i.type === 'produit')
    const paniers = data.items.filter((i) => i.type === 'panier')

    // Creer la commande (le numero sera genere par le trigger)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: commande, error: cmdError } = await (supabase
      .from('commandes') as any)
      .insert({
        client_id: user.id,
        montant_total: montantTotal,
        adresse_livraison: data.adresse || null,
        quartier_livraison: data.quartier,
        telephone_livraison: data.telephone,
        notes: data.notes || null,
        statut: 'en_attente',
        statut_paiement: 'en_attente',
      })
      .select('id, numero')
      .single()

    if (cmdError || !commande) {
      console.error('Erreur creation commande:', cmdError)
      return { success: false, error: 'Erreur lors de la creation' }
    }

    // Inserer les lignes produits
    if (produits.length > 0) {
      const lignes = produits.map((p) => ({
        commande_id: commande.id,
        produit_id: p.id,
        quantite: p.quantite,
        prix_unitaire: p.prix,
        prix_total: p.prix * p.quantite,
      }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: lignesError } = await (supabase
        .from('commandes_lignes') as any)
        .insert(lignes)

      if (lignesError) {
        console.error('Erreur insertion lignes:', lignesError)
      }
    }

    // Inserer les paniers
    if (paniers.length > 0) {
      const paniersData = paniers.map((p) => ({
        commande_id: commande.id,
        panier_semaine_id: p.id,
        quantite: p.quantite,
        prix_unitaire: p.prix,
      }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: paniersError } = await (supabase
        .from('commandes_paniers') as any)
        .insert(paniersData)

      if (paniersError) {
        console.error('Erreur insertion paniers:', paniersError)
      }
    }

    // Creer le paiement en attente
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: paiementError } = await (supabase
      .from('paiements') as any)
      .insert({
        commande_id: commande.id,
        montant: montantTotal,
        methode: data.methode_paiement as PaymentMethod,
        statut: 'en_attente',
      })

    if (paiementError) {
      console.error('Erreur paiement:', paiementError)
    }

    return {
      success: true,
      numero: commande.numero,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { success: false, error: firstError?.message || 'Donnees invalides' }
    }
    console.error('Erreur commande:', error)
    return { success: false, error: 'Erreur serveur' }
  }
}
