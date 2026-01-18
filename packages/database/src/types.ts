// Types TypeScript generes depuis DATABASE_SCHEMA.json
// Ces types representent la structure de la base de donnees Supabase

// === TYPES JSON ===
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// === ENUMS ===

/** Type de panier AMAP */
export type BasketType = 'petit' | 'grand' | 'local'

/** Statut d'une commande */
export type OrderStatus = 
  | 'en_attente' 
  | 'confirmee' 
  | 'preparee' 
  | 'livree' 
  | 'annulee'

/** Methode de paiement acceptee */
export type PaymentMethod = 'especes' | 'tmoney' | 'flooz' | 'credit'

/** Statut du paiement */
export type PaymentStatus = 'en_attente' | 'partiel' | 'paye' | 'rembourse'

/** Unite de mesure pour les produits */
export type ProductUnit = 
  | 'kg' 
  | 'botte' 
  | 'piece' 
  | 'litre' 
  | 'pot' 
  | 'main' 
  | 'plateau'

/** Role utilisateur dans le systeme */
export type UserRole = 
  | 'admin' 
  | 'vendeur' 
  | 'producteur' 
  | 'adherent' 
  | 'client'

// Re-export des types depuis les autres fichiers
export * from './types-tables'
export * from './types-commandes'
export * from './types-rbac'
export type { Database, Paiement, MouvementCredit } from './types-paiements'
