/* Lib pour gestion des cookies RGPD */

export interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const COOKIE_NAME = 'amap_cookie_consent'
const COOKIE_EXPIRY = 365 * 24 * 60 * 60 * 1000 /* 1 an en ms */

/**
 * Obtenir le consentement cookies stocké
 */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(COOKIE_NAME + '='))

  if (!cookie) return null

  try {
    const value = decodeURIComponent(cookie.split('=')[1])
    return JSON.parse(value)
  } catch {
    return null
  }
}

/**
 * Enregistrer le consentement cookies
 */
export function setCookieConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return

  const expiryDate = new Date(Date.now() + COOKIE_EXPIRY)
  const value = encodeURIComponent(JSON.stringify(consent))

  document.cookie = `${COOKIE_NAME}=${value}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`
}

/**
 * Vérifier si le consentement analytics a été donné
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getCookieConsent()
  return consent?.analytics ?? false
}

/**
 * Vérifier si le consentement marketing a été donné
 */
export function hasMarketingConsent(): boolean {
  const consent = getCookieConsent()
  return consent?.marketing ?? false
}

/**
 * Vérifier si l'utilisateur a déjà accepté/refusé
 */
export function hasCookieConsent(): boolean {
  return getCookieConsent() !== null
}

/**
 * Réinitialiser les préférences cookies
 */
export function resetCookieConsent(): void {
  if (typeof window === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
