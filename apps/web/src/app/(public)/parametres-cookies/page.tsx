/* Page dédiée aux paramètres de cookies */

import { Metadata } from 'next'
import { CookieSettings } from '@/components/cookies/cookie-settings'

export const metadata: Metadata = {
  title: 'Paramètres des cookies',
  description: 'Gérez vos préférences de cookies et votre confidentialité.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function CookieSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CookieSettings />
    </div>
  )
}
