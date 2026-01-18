// Modal d'authentification avec effet glassmorphism
// Design moderne et animations fluides

'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { LoginForm } from './login-form'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal d'authentification centre avec Portal
 */
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mounted, setMounted] = useState(false)

  // Monter cote client
  useEffect(() => {
    setMounted(true)
  }, [])

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
        className="fixed inset-0 z-50 bg-black/90 lg:bg-black/50 lg:backdrop-blur-md"
      />

      {/* Modal - Style hamburger mobile, haut sur desktop */}
      <motion.div
        key="auth-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ 
          type: 'spring',
          stiffness: 300,
          damping: 25
        }}
        className="
          fixed z-50
          left-4 right-4 top-24 mx-auto
          max-w-xs
          lg:left-1/2 lg:-translate-x-1/2 lg:top-20 lg:max-w-md
          max-h-[calc(100vh-8rem)]
          overflow-y-auto
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          rounded-2xl shadow-2xl
        "
      >
        {/* Decoration gradient superieur */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500" />

        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 text-center">
          {/* Bouton fermer */}
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </motion.button>

          {/* Logo anime */}
          <motion.div 
            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </motion.div>

          <motion.h2 
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Bienvenue
          </motion.h2>
          <motion.p 
            className="text-sm text-gray-500 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Connectez-vous à votre compte AMAP
          </motion.p>
        </div>

        {/* Contenu - Formulaire */}
        <motion.div 
          className="px-5 pb-6 sm:pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <LoginForm onSuccess={onClose} />
        </motion.div>

        {/* Safe area pour iPhone */}
        <div className="h-2 sm:hidden" />
      </motion.div>
    </AnimatePresence>
  )

  // Utiliser Portal pour z-index correct
  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
