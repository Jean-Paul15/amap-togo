// Panneau d'historique des emails envoyés
// Affichage en slide-over avec détails

'use client'

import { useEffect } from 'react'
import { X, Mail, RefreshCw, ChevronDown, Clock, User } from 'lucide-react'
import { useEmailHistory } from '@/hooks/admin/use-email-history'
import { EmailStatusBadge } from './email-status-badge'

interface EmailHistoryPanelProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Panneau lateral affichant l'historique des emails
 * Design style Apple avec slide-over
 */
export function EmailHistoryPanel({ isOpen, onClose }: EmailHistoryPanelProps) {
  const { 
    emails, 
    isLoading, 
    hasMore, 
    error, 
    loadEmails, 
    loadMore, 
    refresh 
  } = useEmailHistory()

  // Charger au premier affichage
  useEffect(() => {
    if (isOpen && emails.length === 0) {
      loadEmails()
    }
  }, [isOpen, emails.length, loadEmails])

  // Fermeture avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panneau */}
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-xl z-50 
                      flex flex-col transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 safe-area-inset-top">
          <div className="flex items-center gap-2 sm:gap-3">
            <Mail className="w-5 h-5 text-gray-600" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Historique des envois
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Actualiser"
              aria-label="Actualiser la liste"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fermer"
              aria-label="Fermer le panneau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="m-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {isLoading && emails.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Mail className="w-10 h-10 mb-2 opacity-50" />
              <p>Aucun email envoyé</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {emails.map((email) => (
                <EmailHistoryItem key={email.id} email={email} />
              ))}
            </div>
          )}

          {/* Charger plus */}
          {hasMore && (
            <div className="p-4">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="w-full py-2 text-sm text-gray-600 bg-gray-50 
                         rounded-lg hover:bg-gray-100 transition-colors
                         flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                Charger plus
              </button>
            </div>
          )}
        </div>

        {/* Footer avec stats */}
        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50 safe-area-inset-bottom">
          <p className="text-xs text-gray-500 text-center">
            {emails.length} email(s) affiché(s)
          </p>
        </div>
      </div>
    </>
  )
}

// Import du type pour le composant interne
import type { ResendEmail } from '@/types/resend.types'

/** Affiche un email dans la liste */
function EmailHistoryItem({ email }: { email: ResendEmail }) {
  const date = new Date(email.created_at)
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="px-4 sm:px-5 py-3 sm:py-4 hover:bg-gray-50 transition-colors active:bg-gray-100">
      {/* Ligne 1 : Sujet + Badge */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
          {email.subject}
        </h3>
        <EmailStatusBadge status={email.last_event} />
      </div>

      {/* Ligne 2 : Destinataires */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        <User className="w-3 h-3" />
        <span className="truncate">
          {email.to.join(', ')}
        </span>
      </div>

      {/* Ligne 3 : Date */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Clock className="w-3 h-3" />
        <span>{formattedDate}</span>
      </div>
    </div>
  )
}
