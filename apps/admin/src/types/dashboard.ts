// Types pour le dashboard admin

export interface DashboardStats {
  totalProduits: number
  produitsStockFaible: number
  commandesEnAttente: number
  totalClients: number
  chiffreAffaires: number
}

export interface VenteJour {
  jour: string
  total: number
  commandes: number
}

export interface CommandeStatut {
  statut: string
  count: number
  color: string
  [key: string]: string | number
}

export interface ProduitVendu {
  nom: string
  quantite: number
}

export interface DashboardData {
  stats: DashboardStats
  ventesSemaine: VenteJour[]
  commandesParStatut: CommandeStatut[]
  topProduits: ProduitVendu[]
  loading: boolean
  error: string | null
}
