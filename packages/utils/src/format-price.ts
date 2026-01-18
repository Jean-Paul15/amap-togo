/**
 * Formate un prix en FCFA
 * @param price - Prix en centimes (ex: 2200 = 2200 FCFA)
 * @returns Prix formate (ex: "2 200 FCFA")
 */
export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
  
  return `${formatted} FCFA`
}

/**
 * Formate un prix simple sans symbole
 * @param price - Prix en centimes
 * @returns Prix formaté (ex: "2 200")
 */
export function formatPriceSimple(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
