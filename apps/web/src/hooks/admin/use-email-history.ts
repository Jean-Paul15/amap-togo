// Hook pour l'historique des emails envoyés via Resend
// Gestion de la pagination et du rafraîchissement

'use client'

import { useState, useCallback } from 'react'
import type { ResendEmail, ResendEmailListResponse } from '@/types/resend.types'

interface UseEmailHistoryReturn {
  emails: ResendEmail[]
  isLoading: boolean
  hasMore: boolean
  error: string | null
  loadEmails: () => Promise<void>
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

/**
 * Hook pour récupérer l'historique des emails envoyés
 * Supporte la pagination et le rafraîchissement
 */
export function useEmailHistory(): UseEmailHistoryReturn {
  const [emails, setEmails] = useState<ResendEmail[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastId, setLastId] = useState<string | null>(null)

  // Chargement initial ou rafraîchissement
  const loadEmails = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/emails/history?limit=50')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement')
      }

      const data: ResendEmailListResponse = await response.json()
      
      setEmails(data.data)
      setHasMore(data.has_more)
      setLastId(data.data.length > 0 ? data.data[data.data.length - 1].id : null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Charger plus d'emails (pagination)
  const loadMore = useCallback(async () => {
    if (!lastId || isLoading || !hasMore) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/emails/history?limit=50&after=${lastId}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement')
      }

      const data: ResendEmailListResponse = await response.json()
      
      setEmails(prev => [...prev, ...data.data])
      setHasMore(data.has_more)
      setLastId(data.data.length > 0 ? data.data[data.data.length - 1].id : null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [lastId, isLoading, hasMore])

  // Rafraichir la liste complete
  const refresh = useCallback(async () => {
    setEmails([])
    setLastId(null)
    setHasMore(false)
    await loadEmails()
  }, [loadEmails])

  return {
    emails,
    isLoading,
    hasMore,
    error,
    loadEmails,
    loadMore,
    refresh
  }
}
