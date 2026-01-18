// Bouton d'authentification adaptatif
// Affiche Connexion ou UserMenu selon l'etat

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { User } from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { AuthModal } from './auth-modal'
import { UserMenu } from './user-menu'

/**
 * Bouton qui affiche Connexion ou le menu utilisateur
 */
export function AuthButton() {
  return (
    <Suspense fallback={<AuthButtonSkeleton />}>
      <AuthButtonContent />
    </Suspense>
  )
}

function AuthButtonContent() {
  const { isAuthenticated, loading } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchParams = useSearchParams()

  // Ouvrir automatiquement le modal si auth=admin ou auth=required
  useEffect(() => {
    const authParam = searchParams.get('auth')
    if (authParam === 'admin' || authParam === 'required') {
      setIsModalOpen(true)
    }
  }, [searchParams])

  // Chargement
  if (loading) {
    return <AuthButtonSkeleton />
  }

  // Utilisateur connecte
  if (isAuthenticated) {
    return <UserMenu />
  }

  // Non connecte
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          flex items-center gap-2 px-4 py-2
          text-foreground hover:bg-muted
          rounded-lg transition-colors text-sm font-medium
        "
      >
        <User className="w-4 h-4" strokeWidth={1.5} />
        <span className="hidden sm:inline">Connexion</span>
      </button>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

function AuthButtonSkeleton() {
  return <div className="w-24 h-10 bg-muted rounded-lg animate-pulse" />
}
