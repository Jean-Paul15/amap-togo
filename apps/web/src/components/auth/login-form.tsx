// Formulaire de connexion
// Email + mot de passe avec animations fluides

'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { createClientBrowser } from '@amap-togo/database/browser'
import { motion, AnimatePresence } from 'framer-motion'

interface LoginFormProps {
  onSuccess: () => void
}

/**
 * Formulaire de connexion avec animations
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginFormContent onSuccess={onSuccess} />
    </Suspense>
  )
}

function LoginFormContent({ onSuccess }: LoginFormProps) {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // URL de redirection si venant de l'admin
  const redirectUrl = searchParams.get('redirect')
  const isAdminRedirect = searchParams.get('auth') === 'admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClientBrowser()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter')
        } else {
          setError(authError.message)
        }
        return
      }

      if (!data.user) {
        setError('Une erreur est survenue lors de la connexion')
        return
      }

      // Succes - fermer le modal
      onSuccess()

      // Redirection selon le contexte
      if (redirectUrl) {
        const finalUrl = redirectUrl.startsWith('http')
          ? redirectUrl
          : `https://${redirectUrl}`
        window.location.href = finalUrl
      } else if (isAdminRedirect) {
        window.location.href = '/dashboard'
      } else {
        window.location.reload()
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  // Animation des champs
  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1 }
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Message d'erreur anime */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <motion.div variants={inputVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Adresse email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="
              w-full pl-11 pr-4 py-3
              bg-gray-50 border border-gray-200 rounded-xl
              text-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:bg-white
              transition-all duration-200
            "
          />
        </div>
      </motion.div>

      {/* Mot de passe */}
      <motion.div variants={inputVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
            className="
              w-full pl-11 pr-12 py-3
              bg-gray-50 border border-gray-200 rounded-xl
              text-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:bg-white
              transition-all duration-200
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Mot de passe oublie */}
      <div className="text-right">
        <button type="button" className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium">
          Mot de passe oublié ?
        </button>
      </div>

      {/* Bouton connexion avec animation */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="
          w-full py-3.5 
          bg-gradient-to-r from-green-500 to-emerald-600 
          text-white rounded-xl font-semibold text-sm
          hover:from-green-600 hover:to-emerald-700 
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
          shadow-lg shadow-green-200
        "
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connexion en cours...
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Se connecter
          </>
        )}
      </motion.button>
    </motion.form>
  )
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-14 bg-gray-100 rounded-xl animate-pulse" />
      <div className="h-14 bg-gray-100 rounded-xl animate-pulse" />
      <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
    </div>
  )
}
