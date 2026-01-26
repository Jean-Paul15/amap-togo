/* Page mentions légales */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales d\'AMAP TOGO.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Mentions légales
        </h1>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-8">
          {/* Éditeur */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Éditeur du site
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="font-semibold">AMAP TOGO</p>
              <p>Association pour le Maintien d'une Agriculture Paysanne</p>
              <p className="text-sm">Localité : Lomé, Togo</p>
              <p className="text-sm">Email : contact@amaptogo.org</p>
            </div>
          </section>

          {/* Droits auteur */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Droits d'auteur et propriété intellectuelle
            </h2>
            <p>
              Le contenu du site (textes, images, logo, etc.) est la propriété
              exclusive d'AMAP TOGO ou utilisé avec autorisation.
            </p>
            <p className="mt-3">
              Toute reproduction, même partielle, est interdite sans
              consentement écrit préalable.
            </p>
          </section>

          {/* Utilisation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Conditions d'utilisation
            </h2>
            <p className="mb-3">
              En utilisant ce site, vous acceptez de :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respecter la loi locale et internationale</li>
              <li>Ne pas publier de contenu offensant ou illégal</li>
              <li>Ne pas chercher à contourner les mesures de sécurité</li>
              <li>Respecter les droits d'auteur et la vie privée</li>
            </ul>
          </section>

          {/* Limitation responsabilité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Limitation de responsabilité
            </h2>
            <p>
              Le site est fourni « tel quel » sans garantie. AMAP TOGO ne peut
              être tenu responsable de :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Interruptions ou erreurs du service</li>
              <li>Perte de données ou dommages</li>
              <li>Contenus de sites externes liés</li>
              <li>Pertes commerciales ou manques à gagner</li>
            </ul>
          </section>

          {/* Liens externes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Liens externes
            </h2>
            <p>
              Notre site peut contenir des liens vers des sites tiers. Nous ne
              sommes pas responsables du contenu de ces sites et recommandons de
              consulter leurs mentions légales.
            </p>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Données personnelles
            </h2>
            <p>
              Le traitement de vos données personnelles est régi par notre
              <a
                href="/politique-confidentialite"
                className="text-green-600 hover:underline ml-1"
              >
                politique de confidentialité
              </a>
              .
            </p>
          </section>

          {/* Paiements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Paiements et transactions
            </h2>
            <p>
              Les transactions de paiement sont sécurisées et traitées par nos
              prestataires agréés. Les conditions de paiement et retour sont
              disponibles dans les conditions générales de vente.
            </p>
          </section>

          {/* RGPD */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Conformité RGPD
            </h2>
            <p>
              AMAP TOGO se conforme au Règlement Général sur la Protection des
              Données (RGPD). Vous pouvez exercer vos droits en nous contactant.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Modifications
            </h2>
            <p>
              AMAP TOGO se réserve le droit de modifier ces mentions légales à
              tout moment. Les modifications seront publiées sur cette page.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Droit applicable
            </h2>
            <p>
              Ces mentions légales sont régies par la loi du Togo. Tout litige
              sera soumis à la juridiction compétente de Lomé.
            </p>
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
