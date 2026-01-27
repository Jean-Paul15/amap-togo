// Composant Google Tag Manager
// Script d'analyse et de suivi des événements

'use client'

import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/**
 * Composant Google Tag Manager
 * Charge le script GTM et initialise le dataLayer
 */
export function GoogleTagManager() {
  // Ne pas charger en développement ou si GTM_ID absent
  if (!GTM_ID || process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <>
      {/* Script GTM dans le head */}
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
  const pushEvent = (data: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data)
    }
  }

  return { pushEvent }
}


