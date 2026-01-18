// Page de diffusion d'emails
// Style Apple epure

'use client'

import { useState } from 'react'
import { Send, Users, RefreshCw } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { EmailEditor } from '@/components/diffusion/email-editor'
import { RecipientsList } from '@/components/diffusion/recipients-list'
import { useDiffusionEmails } from '@/hooks/use-diffusion-emails'

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
  const [sendResult, setSendResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleSend = async () => {
    if (selectedEmails.length === 0) {
      setSendResult({ success: false, message: 'Selectionnez au moins un destinataire' })
      return
    }
    if (!subject.trim()) {
      setSendResult({ success: false, message: 'Veuillez saisir un sujet' })
      return
    }
    if (!content.trim()) {
      setSendResult({ success: false, message: 'Veuillez saisir un contenu' })
      return
    }

    setIsSending(true)
    setSendResult(null)

    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSending(false)
    setSendResult({
      success: true,
      message: `Email envoye a ${selectedEmails.length} destinataire(s)`
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* En-tete */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Diffusion Email
            </h1>
            <p className="text-sm text-gray-500">
              Envoyez des emails a vos clients
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
            </div>

            {/* Editeur riche */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Message
              </label>
              <EmailEditor value={content} onChange={setContent} />
            </div>

            {/* Resultat */}
            {sendResult && (
              <div className={`p-3 rounded-lg text-sm ${
                sendResult.success 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {sendResult.message}
              </div>
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
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Envoi...
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
      </div>
    </AdminLayout>
  )
}
