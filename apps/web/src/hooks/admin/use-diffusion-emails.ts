// Hook pour recuperer les emails de diffusion
// Combine profils et commandes anonymes

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabaseClient } from '@/lib/supabase'

export interface EmailEntry {
  email: string
  nom: string
  source: 'profil' | 'commande'
}

export function useDiffusionEmails() {
  const [emails, setEmails] = useState<EmailEntry[]>([])
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les emails
  const loadEmails = useCallback(async () => {
    setIsLoading(true)
    const emailMap = new Map<string, EmailEntry>()

    try {
      // 1. Emails des profils
      const { data: profils } = await supabaseClient
        .from('profils')
        .select('email, nom, prenom')
        .not('email', 'is', null)

      if (profils) {
        for (const profil of profils) {
          if (profil.email && isValidEmail(profil.email)) {
            const email = profil.email.toLowerCase().trim()
            emailMap.set(email, {
              email,
              nom: `${profil.prenom || ''} ${profil.nom || ''}`.trim() || email,
              source: 'profil'
            })
          }
        }
      }

      // 2. Emails des commandes anonymes (dans client_anonyme JSONB)
      const { data: commandes } = await supabaseClient
        .from('commandes')
        .select('client_anonyme, telephone_livraison')
        .not('client_anonyme', 'is', null)

      if (commandes) {
        for (const cmd of commandes) {
          const clientAnon = cmd.client_anonyme as {
            nom?: string
            prenom?: string
            email?: string
          } | null

          if (clientAnon?.email && isValidEmail(clientAnon.email)) {
            const email = clientAnon.email.toLowerCase().trim()
            // Ne pas ecraser un profil existant
            if (!emailMap.has(email)) {
              emailMap.set(email, {
                email,
                nom: `${clientAnon.prenom || ''} ${clientAnon.nom || ''}`.trim() || email,
                source: 'commande'
              })
            }
          }
        }
      }

      // Convertir en tableau et trier
      const emailList = Array.from(emailMap.values())
        .sort((a, b) => a.nom.localeCompare(b.nom))

      setEmails(emailList)
    } catch (error) {
      console.error('Erreur chargement emails:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Charger au montage
  useEffect(() => {
    loadEmails()
  }, [loadEmails])

  // Basculer selection d'un email
  const toggleEmail = useCallback((email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    )
  }, [])

  // Tout selectionner
  const selectAll = useCallback(() => {
    setSelectedEmails(emails.map(e => e.email))
  }, [emails])

  // Tout deselectionner
  const deselectAll = useCallback(() => {
    setSelectedEmails([])
  }, [])

  return {
    emails,
    selectedEmails,
    isLoading,
    toggleEmail,
    selectAll,
    deselectAll,
    refresh: loadEmails
  }
}

// Validation email basique
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
