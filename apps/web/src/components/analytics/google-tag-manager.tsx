// Composant Google Tag Manager avec Consent Mode v2
// Script d'analyse conforme RGPD

'use client'

import Script from 'next/script'
import { getCookieConsent } from '@/lib/cookies'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/**
 * Met à jour le consentement dans GTM/GA4
 * Appelé par le CookieBanner quand l'utilisateur fait son choix
 */
export function updateGTMConsent(analytics: boolean, marketing: boolean): void {
  if (typeof window === 'undefined' || !window.dataLayer) return

  window.dataLayer.push({
    event: 'consent_update',
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
  })

  // Mise à jour via gtag si disponible (pour GA4)
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
    })
  }
}

/**
 * Composant Google Tag Manager avec Consent Mode v2
 * - Initialise le consentement en mode "denied" par défaut
 * - Vérifie le consentement existant au chargement
 * - GTM se charge mais ne tracke rien sans consentement
 */
export function GoogleTagManager() {
  // Ne pas charger en développement ou si GTM_ID absent
  if (!GTM_ID || process.env.NODE_ENV === 'development') {
    return null
  }

  // Vérifier le consentement existant (côté client uniquement)
  const existingConsent = typeof window !== 'undefined' ? getCookieConsent() : null
  const analyticsGranted = existingConsent?.analytics ? 'granted' : 'denied'
  const marketingGranted = existingConsent?.marketing ? 'granted' : 'denied'

  return (
    <>
      {/* Script Consent Mode v2 - Configuration par défaut */}
      <Script
        id="gtm-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Consentement par défaut
            gtag('consent', 'default', {
              'analytics_storage': '${analyticsGranted}',
              'ad_storage': '${marketingGranted}',
              'ad_user_data': '${marketingGranted}',
              'ad_personalization': '${marketingGranted}',
              'wait_for_update': 500
            });
            
            // Si consentement déjà accordé, envoyer l'événement consent_update
            if ('${analyticsGranted}' === 'granted') {
              window.dataLayer.push({
                event: 'consent_update',
                analytics_storage: 'granted',
                ad_storage: '${marketingGranted}',
                ad_user_data: '${marketingGranted}',
                ad_personalization: '${marketingGranted}'
              });
            }
            
            // Définir la région (UE = consentement requis)
            gtag('set', 'ads_data_redaction', true);
            gtag('set', 'url_passthrough', true);
          `,
        }}
      />

      {/* Script GTM principal */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />

      {/* Noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}

/**
 * Hook pour envoyer des événements personnalisés à GTM
 * @example
 * const { pushEvent } = useGTM()
 * pushEvent({ event: 'purchase', value: 150 })
 */
export function useGTM() {
  const pushEvent = (data: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data)
    }
  }

  return { pushEvent }
}

// Déclaration TypeScript pour gtag
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
    gtag: (...args: unknown[]) => void
  }
}