// Page affichee quand l'utilisateur n'a aucune permission
// Propose de retourner au site principal

'use client'

import Link from 'next/link'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'

const FRONT_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icone */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldX className="w-10 h-10 text-red-600" />
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Acces non autorise
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Vous n&apos;avez pas les permissions necessaires pour acceder 
          a cette section. Contactez un administrateur si vous pensez 
          qu&apos;il s&apos;agit d&apos;une erreur.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="
              inline-flex items-center justify-center gap-2
              px-4 py-2.5 bg-gray-100 text-gray-700
              rounded-lg font-medium hover:bg-gray-200
              transition-colors
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Tableau de bord
          </Link>
          <a
            href={FRONT_URL}
            className="
              inline-flex items-center justify-center gap-2
              px-4 py-2.5 bg-primary text-white
              rounded-lg font-medium hover:bg-primary/90
              transition-colors
            "
          >
            <Home className="w-4 h-4" />
            Retour au site
          </a>
        </div>
      </div>
    </div>
  )
}
