// Utilitaires pour les dates
// Formatage des dates en francais

/**
 * Formate une plage de dates en francais
 * @param debut - Date de debut (YYYY-MM-DD)
 * @param fin - Date de fin (YYYY-MM-DD)
 * @returns "13 au 19 janvier 2026"
 */
export function formatDateRange(debut: string, fin: string): string {
  const dateDebut = new Date(debut)
  const dateFin = new Date(fin)

  const jourDebut = dateDebut.getDate()
  const jourFin = dateFin.getDate()

  const moisFin = dateFin.toLocaleDateString('fr-FR', { month: 'long' })
  const annee = dateFin.getFullYear()

  // Meme mois
  if (dateDebut.getMonth() === dateFin.getMonth()) {
    return `${jourDebut} au ${jourFin} ${moisFin} ${annee}`
  }

  // Mois differents
  const moisDebut = dateDebut.toLocaleDateString('fr-FR', { month: 'long' })
  return `${jourDebut} ${moisDebut} au ${jourFin} ${moisFin} ${annee}`
}

/**
 * Formate une date en francais
 * @param date - Date (YYYY-MM-DD)
 * @returns "13 janvier 2026"
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
