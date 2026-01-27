/* ⚠️ FICHIER ARCHIVÉ - Google Analytics est maintenant géré via Google Tag Manager
 * Ce composant n'est plus utilisé dans le layout.
 * Pour activer/modifier GA, configure-le dans l'interface GTM : https://tagmanager.google.com
 * 
 * Composant Google Analytics (Legacy - Intégration Directe)
 * Conservé pour référence uniquement
 */

'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { hasAnalyticsConsent } from '@/lib/cookies'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  useEffect(() => {
    /* Vérifier le consentement au chargement et lors des changements */
    const checkConsent = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        const consent = hasAnalyticsConsent()
        window.gtag('consent', 'update', {
          analytics_storage: consent ? 'granted' : 'denied',
        })
      }
    }

    checkConsent()

    /* Réévaluer toutes les 500ms (au cas où l'utilisateur change d'avis) */
    const interval = setInterval(checkConsent, 500)
    return () => clearInterval(interval)
  }, [])

  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          gtag('consent', 'default', {
            'analytics_storage': 'denied'
          });
          
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

declare global {
  interface Window {
    gtag: (
      command: string,
      target: string,
      config?: Record<string, string>
    ) => void
    dataLayer: Record<string, any>[]
  }
}
