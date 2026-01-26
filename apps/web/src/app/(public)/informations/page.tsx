/* Page Informations : hub des ressources légales et aide */

import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ShieldCheck, HelpCircle, Cookie } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Informations',
  description:
    'Accédez rapidement aux informations légales, FAQ, confidentialité, CGV et gestion des cookies.',
  robots: {
    index: true,
    follow: true,
  },
}

const links = [
  {
    title: 'FAQ',
    description: 'Questions fréquentes sur les commandes, livraisons et paiements.',
    href: '/faq',
    icon: HelpCircle,
  },
  {
    title: 'Mentions légales',
    description: "Identité de l'éditeur, propriété intellectuelle et responsabilités.",
    href: '/mentions-legales',
    icon: FileText,
  },
  {
    title: 'Politique de confidentialité',
    description: 'Données collectées, usages, durée de conservation et droits RGPD.',
    href: '/politique-confidentialite',
    icon: ShieldCheck,
  },
  {
    title: 'Conditions générales de vente',
    description: 'Processus de commande, prix, paiement, livraison et garanties.',
    href: '/conditions-generales',
    icon: FileText,
  },
  {
    title: 'Paramètres cookies',
    description: 'Gérez vos préférences (nécessaires, analytiques, marketing).',
    href: '/parametres-cookies',
    icon: Cookie,
  },
]

export default function InformationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">
            Support & Légal
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-3">
            Informations utiles
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Retrouvez en un seul endroit les ressources clés : aide, cadre légal,
            protection des données et gestion des cookies.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mt-1 rounded-lg bg-green-50 p-2 text-green-700">
                <item.icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-green-700">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <span className="text-sm font-semibold text-green-700 mt-2 inline-flex items-center gap-1">
                  Consulter
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
