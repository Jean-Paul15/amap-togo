/* Composant pour les paramètres de cookies détaillés */

'use client'

import { useState } from 'react'
import { setCookieConsent, getCookieConsent } from '@/lib/cookies'
import { updateGTMConsent } from '@/components/analytics/google-tag-manager'
import type { CookieConsent } from '@/lib/cookies'

interface CookieSettingsProps {
  onClose?: () => void
}

export function CookieSettings({ onClose }: CookieSettingsProps) {
  const [consent, setConsent] = useState<CookieConsent>(
    getCookieConsent() || {
      necessary: true,
      analytics: true,
      marketing: false,
    }
  )

  const handleSave = () => {
    setCookieConsent(consent)
    updateGTMConsent(consent.analytics, consent.marketing) // Synchroniser avec GTM
    onClose?.()
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Paramètres des cookies
        </h1>
        <p className="text-gray-600 mb-8">
          Gérez vos préférences de cookies. Les cookies nécessaires ne peuvent
          pas être désactivés car ils sont essentiels au fonctionnement du site.
        </p>

        <div className="space-y-6">
          {/* Cookies nécessaires */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cookies nécessaires
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Essentiels pour le fonctionnement du site : authentification,
                  gestion du panier, sécurité.
                </p>
              </div>
              <input
                type="checkbox"
                checked={true}
                disabled
                className="w-4 h-4 mt-1 rounded"
              />
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-3">
              <li>• Session utilisateur</li>
              <li>• Panier d'achats</li>
              <li>• Authentification</li>
            </ul>
          </div>

          {/* Cookies analytiques */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cookies analytiques
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Nous aident à comprendre comment vous utilisez le site pour
                  l'améliorer continuellement.
                </p>
              </div>
              <input
                type="checkbox"
                checked={consent.analytics}
                onChange={(e) =>
                  setConsent({ ...consent, analytics: e.target.checked })
                }
                className="w-4 h-4 mt-1 rounded cursor-pointer"
              />
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-3">
              <li>• Google Analytics</li>
              <li>• Pages vues et interactions</li>
              <li>• Performance du site</li>
            </ul>
          </div>

          {/* Cookies marketing */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cookies marketing
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Permettent de proposer du contenu personnalisé et des
                  recommandations.
                </p>
              </div>
              <input
                type="checkbox"
                checked={consent.marketing}
                onChange={(e) =>
                  setConsent({ ...consent, marketing: e.target.checked })
                }
                className="w-4 h-4 mt-1 rounded cursor-pointer"
              />
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-3">
              <li>• Recommandations produits</li>
              <li>• Publicités ciblées</li>
              <li>• Historique navigation</li>
            </ul>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => {
              setConsent({ necessary: true, analytics: false, marketing: false })
              handleSave()
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Tout refuser
          </button>
          <button
            onClick={() => {
              setConsent({ necessary: true, analytics: true, marketing: true })
              handleSave()
            }}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Tout accepter
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Enregistrer les préférences
          </button>
        </div>
      </div>
    </div>
  )
}
