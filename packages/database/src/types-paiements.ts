// Types pour les paiements et credits
// Partie 4 : Gestion financiere

import type { PaymentMethod, PaymentStatus } from './types'

// Type JSON local pour eviter import circulaire
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// === PAIEMENTS ===

/** Paiement associe a une commande */
export interface Paiement {
  id: string
  commande_id: string
  montant: number
  methode: PaymentMethod
  reference_externe: string | null
  statut: PaymentStatus
  notes: string | null
  created_at: string
  processed_by: string | null
}

export type PaiementInsert = Omit<Paiement, 'id' | 'created_at'>
export type PaiementUpdate = Partial<Omit<PaiementInsert, 'commande_id'>>

// === MOUVEMENTS DE CREDIT ===

/** Mouvement sur le solde credit d'un adherent */
export interface MouvementCredit {
  id: string
  profil_id: string
  montant: number
  type: 'credit' | 'debit'
  motif: string
  commande_id: string | null
  solde_apres: number
  created_at: string
  created_by: string | null
}

export type MouvementCreditInsert = Omit<
  MouvementCredit, 
  'id' | 'created_at' | 'solde_apres'
>

// === DATABASE INTERFACE ===

/** Interface complete de la base de donnees pour Supabase */
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: import('./types-tables').Categorie
        Insert: import('./types-tables').CategorieInsert
        Update: import('./types-tables').CategorieUpdate
      }
      produits: {
        Row: import('./types-tables').Produit
        Insert: import('./types-tables').ProduitInsert
        Update: import('./types-tables').ProduitUpdate
      }
      profils: {
        Row: import('./types-tables').Profil
        Insert: import('./types-tables').ProfilInsert
        Update: import('./types-tables').ProfilUpdate
      }
      paniers_types: {
        Row: import('./types-commandes').PanierType
      }
      paniers_semaine: {
        Row: import('./types-commandes').PanierSemaine
      }
      paniers_contenu: {
        Row: import('./types-commandes').PanierContenu
      }
      commandes: {
        Row: import('./types-commandes').Commande
        Insert: import('./types-commandes').CommandeInsert
        Update: import('./types-commandes').CommandeUpdate
      }
      commandes_lignes: {
        Row: import('./types-commandes').CommandeLigne
        Insert: import('./types-commandes').CommandeLigneInsert
      }
      commandes_paniers: {
        Row: import('./types-commandes').CommandePanier
        Insert: import('./types-commandes').CommandePanierInsert
      }
      paiements: {
        Row: Paiement
        Insert: PaiementInsert
        Update: PaiementUpdate
      }
      mouvements_credit: {
        Row: MouvementCredit
        Insert: MouvementCreditInsert
      }
    }
    Views: Record<string, never>
    Functions: {
      /** RPC pour creer une commande anonyme (sans authentification) */
      create_anonymous_order: {
        Args: {
          p_nom: string
          p_prenom: string
          p_email?: string | null
          p_telephone: string
          p_quartier: string
          p_adresse?: string | null
          p_notes?: string | null
          p_methode_paiement?: string
          p_items?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      basket_type: import('./types').BasketType
      order_status: import('./types').OrderStatus
      payment_method: import('./types').PaymentMethod
      payment_status: import('./types').PaymentStatus
      product_unit: import('./types').ProductUnit
      user_role: import('./types').UserRole
    }
  }
}
