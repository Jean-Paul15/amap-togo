/* Page politique de confidentialité */

import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Découvrez comment nous traitons vos données personnelles.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Politique de confidentialité
        </h1>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p>
              AMAP TOGO (« nous » ou « notre ») exploite le site amaptogo.org
              (le « Site »). Cette page explique nos politiques concernant la
              collecte, l'utilisation et la divulgation de vos données
              personnelles lorsque vous utilisez notre Site.
            </p>
          </section>

          {/* Définitions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Définitions
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Données personnelles :</strong> Toute information
                concernant une personne physique identifiée ou identifiable.
              </li>
              <li>
                <strong>Traitement :</strong> Toute opération effectuée sur des
                données personnelles.
              </li>
              <li>
                <strong>Responsable de traitement :</strong> AMAP TOGO, entité
                qui détermine les finalités et moyens du traitement.
              </li>
            </ul>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Données que nous collectons
            </h2>
            <p className="font-semibold mb-3">Données directement fournies :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nom, prénom, email, téléphone</li>
              <li>Adresse de livraison</li>
              <li>Historique de commandes</li>
              <li>Préférences de produits</li>
            </ul>

            <p className="font-semibold mb-3 mt-4">Données collectées automatiquement :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Adresse IP et type de navigateur</li>
              <li>Pages visitées et temps passé</li>
              <li>Données de cookies (avec votre consentement)</li>
              <li>Données de localisation (si autorisé)</li>
            </ul>
          </section>

          {/* Utilisation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Utilisation de vos données
            </h2>
            <p className="mb-3">Nous utilisons vos données pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Traiter et livrer vos commandes</li>
              <li>Gérer votre compte et accès au Site</li>
              <li>Vous envoyer des mises à jour produits</li>
              <li>Améliorer notre Site et services</li>
              <li>Respecter les obligations légales</li>
              <li>Prévenir les fraudes et abus (si autorisé)</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Cookies et technologies de suivi
            </h2>
            <p className="mb-3">
              Nous utilisons les cookies pour améliorer votre expérience. Vous
              pouvez contrôler les cookies via nos{' '}
              <Link
                href="/parametres-cookies"
                className="text-green-600 hover:underline"
              >
                paramètres de cookies
              </Link>
              .
            </p>

            <p className="font-semibold mb-3">Types de cookies :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Essentiels :</strong> Authentification, panier
              </li>
              <li>
                <strong>Analytiques :</strong> Amélioration du Site (si autorisé)
              </li>
              <li>
                <strong>Marketing :</strong> Contenu personnalisé (si autorisé)
              </li>
            </ul>
          </section>

          {/* Partage */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Partage de vos données
            </h2>
            <p>
              Nous ne partageons vos données personnelles que :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Avec nos prestataires de service (paiement, livraison)</li>
              <li>Si requis par la loi</li>
              <li>Avec votre consentement explicite</li>
            </ul>
            <p className="mt-3 font-semibold">
              Nous ne vendons jamais vos données à des tiers.
            </p>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Sécurité des données
            </h2>
            <p>
              Nous mettons en place des mesures techniques et organisationnelles
              pour protéger vos données contre les accès non autorisés, les
              modifications ou les divulgations.
            </p>
          </section>

          {/* Droits */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Vos droits RGPD
            </h2>
            <p className="mb-3">
              Vous avez le droit de :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Accès :</strong> Obtenir une copie de vos données
              </li>
              <li>
                <strong>Rectification :</strong> Corriger des données inexactes
              </li>
              <li>
                <strong>Suppression :</strong> Demander l'effacement (« droit à l'oubli »)
              </li>
              <li>
                <strong>Limitation :</strong> Limiter le traitement
              </li>
              <li>
                <strong>Portabilité :</strong> Recevoir vos données dans un format courant
              </li>
              <li>
                <strong>Opposition :</strong> Vous opposer au traitement
              </li>
            </ul>

            <p className="mt-4 font-semibold">
              Pour exercer ces droits, contactez-nous à :
            </p>
            <p className="mt-2">
              Email :{' '}
              <a
                href="mailto:contact@amaptogo.org"
                className="text-green-600 hover:underline"
              >
                contact@amaptogo.org
              </a>
            </p>
          </section>

          {/* Durée */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Durée de conservation
            </h2>
            <p>
              Nous conservons vos données personnelles aussi longtemps que
              nécessaire pour les finalités mentionnées, ou selon les exigences
              légales (ex. 10 ans pour les factures).
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Nous contacter
            </h2>
            <p>
              Pour toute question concernant cette politique, contactez-nous :
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">AMAP TOGO</p>
              <p className="text-sm">Email : contact@amaptogo.org</p>
              <p className="text-sm">Localité : Lomé, Togo</p>
            </div>
          </section>

          {/* Dernière mise à jour */}
          <div className="pt-8 border-t border-gray-200 text-sm text-gray-600">
            <p>
              Dernière mise à jour : 26 janvier 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
