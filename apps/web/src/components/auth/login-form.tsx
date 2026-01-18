// Formulaire de connexion
// Email + mot de passe avec Supabase Auth

'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClientBrowser } from '@amap-togo/database/browser'

interface LoginFormProps {
  onSuccess: () => void
}

/**
 * Formulaire de connexion
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
        // Venant de l'admin : retourner a l'URL demandee
        // S'assurer que c'est une URL complete (commence par http:// ou https://)
        const finalUrl = redirectUrl.startsWith('http')
          ? redirectUrl
          : `https://${redirectUrl}`
        window.location.href = finalUrl
      } else if (isAdminRedirect) {
        // Demande admin : aller au dashboard (meme site)
        window.location.href = '/dashboard'
      } else {
        // Connexion normale : rafraichir
        window.location.reload()
      }
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="
              w-full pl-10 pr-4 py-2.5
              bg-white border border-gray-300 rounded-lg
              text-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            "
          />
        </div>
      </div>

      {/* Mot de passe */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
            className="
              w-full pl-10 pr-12 py-2.5
              bg-white border border-gray-300 rounded-lg
              text-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mot de passe oublie */}
      <div className="text-right">
        <button type="button" className="text-sm text-primary hover:underline">
          Mot de passe oublie ?
        </button>
      </div>

      {/* Bouton connexion */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-2.5 bg-primary text-white
          rounded-lg font-medium text-sm
          hover:bg-primary/90 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connexion...
          </>
        ) : (
          'Se connecter'
        )}
      </button>

    </form>
  )
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-12 bg-muted rounded-lg animate-pulse" />
      <div className="h-12 bg-muted rounded-lg animate-pulse" />
      <div className="h-10 bg-muted rounded-lg animate-pulse" />
    </div>
  )
}
