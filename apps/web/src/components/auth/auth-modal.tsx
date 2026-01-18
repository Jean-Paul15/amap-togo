// Modal d'authentification avec effet glassmorphism
// Onglets Connexion / Inscription

'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { LoginForm } from './login-form'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal d'authentification glassmorphism
 */
export function AuthModal({ isOpen, onClose }: AuthModalProps) {

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Bloquer scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const modalContent = (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="auth-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal glassmorphism */}
      <motion.div
        key="auth-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="
          fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-full max-w-md mx-4
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          rounded-xl shadow-2xl
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="relative p-4 pb-3 text-center">
          {/* Bouton fermer */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Logo */}
          <div className="w-12 h-12 mx-auto mb-3 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold text-white">A</span>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connexion
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Connectez-vous a votre compte
          </p>
        </div>

        {/* Onglets - DESACTIVES temporairement
        <div className="flex mx-6 mb-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`
              flex-1 py-2 text-sm font-medium rounded-md transition-all
              ${activeTab === 'login'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            Connexion
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`
              flex-1 py-2 text-sm font-medium rounded-md transition-all
              ${activeTab === 'register'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            Inscription
          </button>
        </div>
        */}

        {/* Contenu - Connexion uniquement */}
        <div className="px-5 pb-5">
          <LoginForm onSuccess={onClose} />
        </div>
      </motion.div>
    </AnimatePresence>
  )

  return modalContent
}
