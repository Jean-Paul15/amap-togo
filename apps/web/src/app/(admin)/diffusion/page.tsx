// Page de diffusion d'emails avec Resend
// Style Apple épuré avec historique

'use client'

import { useState } from 'react'
import { Send, Users, RefreshCw, History } from 'lucide-react'
import { EmailEditor } from '@/components/admin/diffusion/email-editor'
import { RecipientsList } from '@/components/admin/diffusion/recipients-list'
import { EmailHistoryPanel } from '@/components/admin/diffusion/email-history-panel'
import { SendResultDisplay } from '@/components/admin/diffusion/send-result-display'
import { useDiffusionEmails } from '@/hooks/admin/use-diffusion-emails'
import type { CampaignSendResult } from '@/types/resend.types'

export default function DiffusionPage() {
  const { 
    emails, 
    selectedEmails, 
    isLoading, 
    toggleEmail, 
    selectAll, 
    deselectAll,
    refresh 
  } = useDiffusionEmails()

  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<CampaignSendResult | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  // Envoi réel via Resend
  const handleSend = async () => {
    if (selectedEmails.length === 0) {
      setSendResult({ 
        success: false, 
        total: 0, 
        sent: 0, 
        failed: 0,
        message: 'Sélectionnez au moins un destinataire',
        details: []
      })
      return
    }
    if (!subject.trim()) {
      setSendResult({ 
        success: false, 
        total: 0, 
        sent: 0, 
        failed: 0,
        message: 'Veuillez saisir un sujet',
        details: []
      })
      return
    }
    if (!content.trim()) {
      setSendResult({ 
        success: false, 
        total: 0, 
        sent: 0, 
        failed: 0,
        message: 'Veuillez saisir un contenu',
        details: []
      })
      return
    }

    setIsSending(true)
    setSendResult(null)

    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: selectedEmails,
          subject: subject.trim(),
          htmlContent: content
        })
      })

      const result: CampaignSendResult = await response.json()
      setSendResult(result)

      // Reset si succes complet
      if (result.success && result.failed === 0) {
        setSubject('')
        setContent('')
        deselectAll()
      }
    } catch {
      setSendResult({
        success: false,
        total: selectedEmails.length,
        sent: 0,
        failed: selectedEmails.length,
        message: 'Erreur de connexion au serveur',
        details: []
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Diffusion Email
          </h1>
          <p className="text-sm text-gray-500">
            Envoyez des emails à vos clients via Resend
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 text-sm text-gray-600 
                     bg-white border border-gray-200 rounded-lg hover:bg-gray-50 
                     transition-colors"
          >
            <History className="w-4 h-4" />
            Historique
          </button>
          <button
            onClick={refresh}
            disabled={isLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 text-sm text-gray-600 
                     bg-white border border-gray-200 rounded-lg hover:bg-gray-50 
                     transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Liste des destinataires */}
        <div className="lg:col-span-1">
          <RecipientsList
            emails={emails}
            selectedEmails={selectedEmails}
            isLoading={isLoading}
            onToggle={toggleEmail}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
          />
        </div>

        {/* Editeur email */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sujet */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Sujet
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Nouveaux produits disponibles"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 
                       focus:border-green-400"
            />
          </div>

          {/* Editeur riche */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Message
            </label>
            <EmailEditor value={content} onChange={setContent} />
          </div>

          {/* Resultat d'envoi */}
          {sendResult && (
            <SendResultDisplay 
              result={sendResult} 
              onDismiss={() => setSendResult(null)} 
            />
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{selectedEmails.length} destinataire(s)</span>
            </div>
            <button
              onClick={handleSend}
              disabled={isSending || selectedEmails.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white 
                       text-sm font-medium rounded-lg hover:bg-gray-800 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Panneau historique */}
      <EmailHistoryPanel 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
      />
    </div>
  )
}
