import { STATUT_COMMANDE_LABELS, STATUT_PAIEMENT_LABELS } from './constants'

/**
 * Formate un statut de commande avec les accents appropriés
 */
export function formatStatut(statut: string): string {
  return STATUT_COMMANDE_LABELS[statut as keyof typeof STATUT_COMMANDE_LABELS] || statut.replace(/_/g, ' ')
}

/**
 * Formate un statut de paiement avec les accents appropriés
 */
export function formatStatutPaiement(statut: string): string {
  return STATUT_PAIEMENT_LABELS[statut as keyof typeof STATUT_PAIEMENT_LABELS] || statut.replace(/_/g, ' ')
}

