export const CONTACT = {
  phones: ['+228 92 71 95 96', '+228 92 64 70 61', '+228 91 67 87 40'],
  email: 'amap.togo@gmail.com',
  address: 'Ancien Centre Mytro Nunya, Adidogome (près de l\'OTR)',
  deliveryDay: 'Mercredi à partir de 11h30',
} as const

export const PANIER_TYPES = {
  petit_classique: {
    nom: 'Petit panier classique',
    prix: 4500,
  },
  grand_classique: {
    nom: 'Grand panier classique',
    prix: 8000,
  },
  panier_local: {
    nom: 'Panier local',
    prix: 4000,
  },
} as const

export const UNITE_LABELS = {
  kg: 'kg',
  g: 'g',
  l: 'l',
  ml: 'ml',
  piece: 'pièce',
  botte: 'botte',
  sachet: 'sachet',
} as const

export const STATUT_COMMANDE_LABELS = {
  brouillon: 'Brouillon',
  validee: 'Validée',
  en_preparation: 'En préparation',
  prete: 'Prête',
  en_livraison: 'En livraison',
  livree: 'Livrée',
  annulee: 'Annulée',
} as const

export const METHODE_PAIEMENT_LABELS = {
  especes: 'Espèces',
  tmoney: 'TMoney',
  flooz: 'Flooz',
  credit: 'Crédit',
} as const
