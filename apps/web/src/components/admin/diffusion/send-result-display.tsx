// Résultat d'envoi de campagne email
// Affiche le feedback détaillé

'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react'
import type { CampaignSendResult } from '@/types/resend.types'

interface SendResultDisplayProps {
  result: CampaignSendResult
  onDismiss: () => void
}

/**
 * Affiche le résultat d'une campagne d'envoi
 * Avec détails par destinataire en accordéon
 */
export function SendResultDisplay({ result, onDismiss }: SendResultDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  const bgColor = result.success ? 'bg-green-50' : 'bg-red-50'
  const borderColor = result.success ? 'border-green-200' : 'border-red-200'
  const iconColor = result.success ? 'text-green-600' : 'text-red-600'

  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} overflow-hidden`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {result.success ? (
            <CheckCircle className={`w-5 h-5 mt-0.5 ${iconColor}`} />
          ) : (
            <XCircle className={`w-5 h-5 mt-0.5 ${iconColor}`} />
          )}
          
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {result.message}
            </p>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {result.sent}/{result.total} envoyé(s)
              </span>
              {result.failed > 0 && (
                <span className="text-red-600">
                  {result.failed} échec(s)
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Fermer
          </button>
        </div>

        {/* Bouton details */}
        {result.details.length > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Masquer les détails
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Voir les détails
              </>
            )}
          </button>
        )}
      </div>

      {/* Details par destinataire */}
      {showDetails && (
        <div className="border-t border-gray-200/50 bg-white/50 max-h-48 overflow-y-auto">
          {result.details.map((detail, index) => (
            <div 
              key={index}
              className="flex items-center justify-between px-4 py-2 text-xs border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-700 truncate flex-1">
                {detail.email}
              </span>
              {detail.success ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Envoyé
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1" title={detail.error}>
                  <XCircle className="w-3 h-3" />
                  Échec
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
