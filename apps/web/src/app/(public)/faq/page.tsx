/* Page FAQ */

import { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Questions fréquentes',
  description: 'Réponses aux questions fréquemment posées sur AMAP TOGO.',
  robots: {
    index: true,
    follow: true,
  },
}

const faqs = [
  {
    id: 1,
    question: 'Comment puis-je commander?',
    answer:
      'Créez un compte sur notre site, sélectionnez les produits ou paniers que vous désirez, puis procédez au paiement. Vous recevrez une confirmation par email.',
  },
  {
    id: 2,
    question: 'Quels sont les moyens de paiement acceptés?',
    answer:
      'Nous acceptons Orange Money, Moov Money et les virements bancaires. Tous les paiements sont sécurisés.',
  },
  {
    id: 3,
    question: 'Quand serai-je livré?',
    answer:
      'Les commandes passées avant jeudi sont livrées le samedi ou dimanche suivant. Les livraisons se font à Lomé.',
  },
  {
    id: 4,
    question: 'Y a-t-il des frais de livraison?',
    answer:
      'Les frais de livraison dépendent de votre zone. Le montant est affiché avant la validation de votre commande.',
  },
  {
    id: 5,
    question: 'Puis-je annuler ma commande?',
    answer:
      'Vous pouvez annuler votre commande jusqu\'au jeudi précédent la livraison. Contactez-nous à contact@amaptogo.org.',
  },
  {
    id: 6,
    question: 'Vos produits sont-ils vraiment bio?',
    answer:
      'Oui, tous nos produits sont biologiques et cultivés localement par nos partenaires agricoles au Togo.',
  },
  {
    id: 7,
    question: 'Que faire si un produit est endommagé à la livraison?',
    answer:
      'Contactez-nous dans les 24 heures suivant la livraison avec une photo du produit endommagé. Nous vous enverrons un remplacement ou un remboursement.',
  },
  {
    id: 8,
    question: 'Avez-vous une politique de retour?',
    answer:
      'Oui, vous avez 7 jours après la livraison pour retourner un produit non entamé. Les produits alimentaires entamés ne peuvent pas être retournés.',
  },
  {
    id: 9,
    question: 'Comment puis-je modifier ma commande?',
    answer:
      'Les modifications sont possibles jusqu\'au jeudi avant la livraison prévue. Connectez-vous à votre compte ou contactez-nous.',
  },
  {
    id: 10,
    question: 'Livrez-vous en dehors de Lomé?',
    answer:
      'Actuellement, nous livrons uniquement à Lomé. Nous étudions l\'expansion à d\'autres régions.',
  },
]

function FAQItem({
  question,
  answer,
}: {
  question: string
  answer: string
  index: number
}) {
  return (
    <details className="group border border-gray-200 rounded-lg overflow-hidden">
      <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900">{question}</span>
        <ChevronDown className="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform" />
      </summary>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">
        {answer}
      </div>
    </details>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h1>
          <p className="text-lg text-gray-600">
            Trouvez rapidement les réponses à vos questions sur AMAP TOGO.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 bg-white rounded-xl shadow-sm overflow-hidden">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              index={0}
            />
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vous n'avez pas trouvé votre réponse?
          </h2>
          <p className="text-gray-600 mb-4">
            Contactez-nous directement, nous sommes là pour vous aider!
          </p>
          <a
            href="mailto:contact@amaptogo.org"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Nous envoyer un message
          </a>
        </div>
      </div>
    </div>
  )
}
