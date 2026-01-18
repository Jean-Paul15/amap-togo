// Types pour les paniers et commandes
// Partie 3 : Gestion des ventes

import type { 
  BasketType, 
  OrderStatus, 
  PaymentStatus 
} from './types'
import type { Produit, Profil } from './types-tables'

// === TYPES DE PANIERS ===

/** Type de panier AMAP (petit, grand, local) */
export interface PanierType {
  id: string
  type: BasketType
  nom: string
  prix: number
  description: string | null
  actif: boolean
  created_at: string
}

// === PANIERS DE LA SEMAINE ===

/** Panier compose pour une semaine donnee */
export interface PanierSemaine {
  id: string
  panier_type_id: string
  semaine_debut: string
  semaine_fin: string
  actif: boolean
  created_at: string
  created_by: string | null
}

/** Panier semaine avec son type et contenu */
export interface PanierSemaineComplet extends PanierSemaine {
  panier_type: PanierType
  contenu: PanierContenu[]
}

/** Contenu d'un panier (produits inclus) */
export interface PanierContenu {
  id: string
  panier_semaine_id: string
  produit_id: string
  quantite: number
  produit?: Produit
}

// === COMMANDES ===

/** Commande client */
export interface Commande {
  id: string
  numero: string
  client_id: string
  statut: OrderStatus
  statut_paiement: PaymentStatus
  montant_total: number
  montant_paye: number
  adresse_livraison: string | null
  quartier_livraison: string | null
  telephone_livraison: string | null
  notes: string | null
  date_livraison_souhaitee: string | null
  created_at: string
  updated_at: string
  validated_by: string | null
  validated_at: string | null
}

/** Insert pour commande (numero genere par trigger) */
export type CommandeInsert = Omit<
  Commande,
  'id' | 'numero' | 'created_at' | 'updated_at' | 'validated_by' | 'validated_at'
> & {
  numero?: string
}

/** Update pour commande */
export type CommandeUpdate = Partial<Omit<CommandeInsert, 'client_id'>>

/** Commande avec le profil client */
export interface CommandeComplete extends Commande {
  client: Profil
  lignes: CommandeLigne[]
  paniers: CommandePanier[]
}

// === LIGNES DE COMMANDE ===

/** Ligne de commande (produit individuel) */
export interface CommandeLigne {
  id: string
  commande_id: string
  produit_id: string
  quantite: number
  prix_unitaire: number
  prix_total: number
  produit?: Produit
}

/** Insert pour ligne de commande */
export type CommandeLigneInsert = Omit<CommandeLigne, 'id' | 'produit'>

/** Panier dans une commande */
export interface CommandePanier {
  id: string
  commande_id: string
  panier_semaine_id: string
  quantite: number
  prix_unitaire: number
  panier_semaine?: PanierSemaineComplet
}

/** Insert pour panier dans commande */
export type CommandePanierInsert = Omit<CommandePanier, 'id' | 'panier_semaine'>
