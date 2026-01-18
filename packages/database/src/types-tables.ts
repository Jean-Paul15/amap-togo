// Types pour les tables de la base de donnees
// Partie 2 : Entites principales

import type { ProductUnit, UserRole } from './types'

// === CATEGORIES ===

/** Categorie de produits */
export interface Categorie {
  id: string
  nom: string
  slug: string
  description: string | null
  ordre: number
  actif: boolean
  created_at: string
  updated_at: string
}

export type CategorieInsert = Omit<Categorie, 'id' | 'created_at' | 'updated_at'>
export type CategorieUpdate = Partial<CategorieInsert>

// === PRODUITS ===

/** Produit agricole vendu par l'AMAP */
export interface Produit {
  id: string
  categorie_id: string
  nom: string
  slug: string
  description: string | null
  prix: number
  unite: ProductUnit
  stock: number
  seuil_alerte: number
  image_url: string | null
  actif: boolean
  disponible_semaine: boolean
  ordre: number
  created_at: string
  updated_at: string
}

/** Produit avec sa categorie jointe */
export interface ProduitAvecCategorie extends Produit {
  categorie: Categorie
}

export type ProduitInsert = Omit<Produit, 'id' | 'created_at' | 'updated_at'>
export type ProduitUpdate = Partial<ProduitInsert>

// === PROFILS UTILISATEURS ===

/** Profil utilisateur lie a auth.users avec RBAC */
export interface Profil {
  id: string
  email: string
  nom: string
  prenom: string
  telephone: string | null
  adresse: string | null
  quartier: string | null
  role_id: string
  /** @deprecated Utiliser role_id avec jointure sur roles */
  role?: UserRole
  solde_credit: number
  actif: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

/** Profil avec le role joint */
export interface ProfilAvecRole extends Profil {
  roles?: { nom: string } | { nom: string }[] | null
}

export type ProfilInsert = Omit<Profil, 'created_at' | 'updated_at' | 'role'>
export type ProfilUpdate = Partial<Omit<ProfilInsert, 'id' | 'email'>>
