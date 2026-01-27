/* Page conditions générales de vente */

import { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY, CONTACT } from '@amap-togo/utils'

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description: 'Conditions générales de vente d\'AMAP TOGO.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Conditions générales de vente
        </h1>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-8">
          {/* Objet */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Objet
            </h2>
            <p>
              {COMPANY.name} propose la vente de produits agricoles bio et locaux.
              Ces conditions générales régissent les relations entre {COMPANY.name}
              (vendeur) et l'acheteur.
            </p>
          </section>

          {/* Produits */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Produits et prix
            </h2>
            <p className="mb-3">
              Les produits proposés sur notre site sont décrits avec le maximum
              de précision possible.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Les prix affichés sont en FCFA TTC (toutes taxes comprises)
              </li>
              <li>
                Les prix peuvent être modifiés sans préavis sur le site
              </li>
              <li>
                Le prix d'une commande est fixé au moment de la validation
              </li>
              <li>
                Les produits sont soumis à la disponibilité et peuvent varier
              </li>
            </ul>
          </section>

          {/* Commandes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Commandes et validation
            </h2>
            <p className="mb-3">
              Pour passer une commande :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Créer un compte utilisateur</li>
              <li>Sélectionner les produits et panier</li>
              <li>Valider l'adresse de livraison</li>
              <li>Effectuer le paiement</li>
            </ul>

            <p className="mt-4 font-semibold">
              Une confirmation d'ordre sera envoyée par email.
            </p>
          </section>

          {/* Paiement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Paiement
            </h2>
            <p className="mb-3">
              Le paiement doit être effectué avant la livraison.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Moyens acceptés : Orange Money, Moov Money, virement bancaire
              </li>
              <li>
                Les transactions sont sécurisées par nos prestataires
              </li>
              <li>
                Aucune donnée bancaire n'est stockée sur nos serveurs
              </li>
              <li>
                Les remboursements sont effectués sous 5-7 jours ouvrables
              </li>
            </ul>
          </section>

          {/* Livraison */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Livraison
            </h2>
            <p className="mb-3">
              Les commandes sont livrées à Lomé selon les modalités suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Livraison prévue le samedi ou dimanche suivant la commande</li>
              <li>
                L'adresse de livraison doit être à Lomé
              </li>
              <li>
                Des frais de livraison peuvent s'appliquer selon la zone
              </li>
              <li>
                AMAP TOGO n'est responsable que jusqu'à la livraison
              </li>
            </ul>

            <p className="mt-4 font-semibold">
              En cas d'absence, un message de notification sera laissé.
            </p>
          </section>

          {/* Droit de rétractation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Droit de rétractation
            </h2>
            <p>
              Selon la loi du Togo, vous avez le droit de vous rétracter dans
              les 7 jours à partir de la livraison, sous conditions :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Les produits doivent être dans leur état d'origine</li>
              <li>
                Les produits alimentaires ne peuvent pas être rétractés s'ils
                ont été entamés
              </li>
              <li>
                Un remboursement sera effectué après vérification des produits
              </li>
            </ul>

            <p className="mt-3">
              Pour vous rétracter, écrivez à :{' '}
              <a
                href="mailto:contact@amaptogo.org"
                className="text-green-600 hover:underline"
              >
                contact@amaptogo.org
              </a>
            </p>
          </section>

          {/* Qualité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Garantie et qualité
            </h2>
            <p>
              AMAP TOGO garantit la qualité de ses produits au moment de la
              livraison. En cas de défaut ou dommage à la livraison,
              contactez-nous dans les 24h.
            </p>

            <p className="mt-3 font-semibold">
              Les produits biologiques peuvent varier en taille et couleur.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Limitation de responsabilité
            </h2>
            <p>
              AMAP TOGO n'est pas responsable des dommages indirects,
              pertes commerciales ou manques à gagner résultant de l'utilisation
              des produits.
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Propriété intellectuelle
            </h2>
            <p>
              Tous les contenus du site (textes, images, logos) sont protégés
              par le droit d'auteur. Toute reproduction sans autorisation est
              interdite.
            </p>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Données personnelles
            </h2>
            <p>
              Vos données sont traitées selon notre{' '}
              <Link
                href="/politique-confidentialite"
                className="text-green-600 hover:underline"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </section>

          {/* Modification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Modification des conditions
            </h2>
            <p>
              AMAP TOGO se réserve le droit de modifier ces conditions à tout
              moment. Les modifications seront publiées sur le site.
            </p>
          </section>

          {/* Litiges */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Résolution des litiges
            </h2>
            <p>
              En cas de litige, nous chercherons d'abord une résolution amiable.
              Les litiges seront soumis aux tribunaux compétents de Lomé.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Contact
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">{COMPANY.name}</p>
              <p className="text-sm">
                Email :{' '}
                <a
                  href={`mailto:${CONTACT.contactEmail}`}
                  className="text-green-600 hover:underline"
                >
                  {CONTACT.contactEmail}
                </a>
              </p>
              <p className="text-sm">Localité : {CONTACT.city}, {CONTACT.country}</p>
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
