// Confirmation de commande
// Affiche numero de commande et bouton fermer

'use client'

import { CheckCircle, Download, FileText } from 'lucide-react'

interface POSOrderConfirmationProps {
  orderNumber: string
  onClose: () => void
  onDownloadFacture?: () => void
}

/**
 * Ecran de confirmation apres commande validee
 */
export function POSOrderConfirmation({
  orderNumber,
  onClose,
  onDownloadFacture,
}: POSOrderConfirmationProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      {/* Icone succes */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      {/* Message */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Commande confirmee !
      </h3>
      <p className="text-muted-foreground mb-4">
        Votre commande a ete enregistree avec succes.
      </p>

      {/* Numero de commande */}
      <div className="bg-muted px-4 py-3 rounded-lg mb-4">
        <p className="text-xs text-muted-foreground mb-1">
          Numero de commande
        </p>
        <p className="text-lg font-mono font-bold text-foreground">
          {orderNumber}
        </p>
      </div>

      {/* Info facture */}
      <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
        <FileText className="w-4 h-4" />
        <span>Votre facture a ete telechargee</span>
      </div>

      {/* Bouton re-telecharger facture */}
      {onDownloadFacture && (
        <button
          onClick={onDownloadFacture}
          className="
            flex items-center gap-2 px-4 py-2
            text-sm text-primary border border-primary
            rounded-lg hover:bg-primary/5 transition-colors mb-6
          "
        >
          <Download className="w-4 h-4" />
          Telecharger la facture
        </button>
      )}

      {/* Info livraison */}
      <p className="text-sm text-muted-foreground mb-8">
        Notre equipe vous contactera bientot pour confirmer la livraison.
      </p>

      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="
          px-6 py-3 bg-primary text-primary-foreground
          rounded-lg font-medium
          hover:bg-primary/90 transition-colors
        "
      >
        Fermer
      </button>
    </div>
  )
}
