/* Bannière de consentement cookies RGPD */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'
import {
  setCookieConsent,
  hasCookieConsent,
} from '@/lib/cookies'
import { updateGTMConsent } from '@/components/analytics/google-tag-manager'
import type { CookieConsent } from '@/lib/cookies'

export function CookieBanner() {
  const [shown, setShown] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: true,
    marketing: false,
  })

  useEffect(() => {
    /* Vérifier si l'utilisateur a déjà accepté */
    if (!hasCookieConsent()) {
      setShown(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    setCookieConsent(newConsent)
    updateGTMConsent(true, true) // Mettre à jour GTM avec le consentement
    setConsent(newConsent)
    setShown(false)
  }

  const handleRejectAll = () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    setCookieConsent(newConsent)
    updateGTMConsent(false, false) // Mettre à jour GTM avec le refus
    setConsent(newConsent)
    setShown(false)
  }

  const handleSavePreferences = () => {
    setCookieConsent(consent)
    updateGTMConsent(consent.analytics, consent.marketing) // Mettre à jour GTM
    setShown(false)
  }

  if (!shown) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start gap-4">
          {/* Icône */}
          <Cookie className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />

          {/* Contenu */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Gestion des cookies
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Nous utilisons les cookies pour améliorer votre expérience. Les cookies
              nécessaires sont toujours actifs. Vous pouvez personnaliser vos
              préférences.
            </p>

            {/* Catégories */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-4 h-4 text-green-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">Nécessaires</span> (toujours actifs)
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) =>
                    setConsent({ ...consent, analytics: e.target.checked })
                  }
                  className="w-4 h-4 text-green-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  Cookies analytiques
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={consent.marketing}
                  onChange={(e) =>
                    setConsent({ ...consent, marketing: e.target.checked })
                  }
                  className="w-4 h-4 text-green-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  Cookies marketing
                </span>
              </label>
            </div>

            {/* Lien politique */}
            <p className="text-xs text-gray-500 mb-4">
              Consultez notre{' '}
              <Link
                href="/politique-confidentialite"
                className="text-green-600 hover:underline"
              >
                politique de confidentialité
              </Link>
            </p>
          </div>

          {/* Boutons */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              Accepter tout
            </button>
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
            >
              Enregistrer
            </button>
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Refuser tout
            </button>
          </div>

          {/* Fermer */}
          <button
            onClick={() => setShown(false)}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
