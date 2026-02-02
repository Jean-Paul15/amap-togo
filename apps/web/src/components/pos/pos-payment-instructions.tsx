'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export type PaymentMethodType = 'especes' | 'mixx' | 'flooz' | 'tmoney'

interface POSPaymentInstructionsProps {
    method: PaymentMethodType
    amount: number
}

export function POSPaymentInstructions({ method, amount }: POSPaymentInstructionsProps) {
    const [copied, setCopied] = useState(false)

    if (method === 'especes') return null

    // Configuration selon la méthode
    const config = {
        tmoney: {
            name: 'T-Money',
            number: '92719596',
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            description: 'Togocel'
        },
        flooz: {
            name: 'Flooz',
            number: '98396447',
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            description: 'Moov Africa'
        },
        // Fallback pour compatibilité si 'mixx' est encore utilisé
        mixx: {
            name: 'T-Money',
            number: '92719596',
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            description: 'Togocel'
        }
    }

    const currentConfig = config[method as keyof typeof config]

    if (!currentConfig) return null

    const handleCopy = () => {
        navigator.clipboard.writeText(currentConfig.number)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`mt-4 p-4 rounded-lg border ${currentConfig.color}`}>
            <h5 className="font-semibold flex items-center gap-2 mb-2">
                Instructions de paiement {currentConfig.name}
            </h5>

            <div className="space-y-3 text-sm">
                <p>
                    Veuillez envoyer <strong>{amount.toLocaleString('fr-FR')} FCFA</strong> au numéro suivant :
                </p>

                <div className="flex items-center gap-2 bg-white/50 p-2 rounded border border-black/5">
                    <div className="flex-1">
                        <span className="font-mono text-lg font-bold tracking-wider">
                            {currentConfig.number}
                        </span>
                        <span className="ml-2 text-xs opacity-70">({currentConfig.description})</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-white rounded transition-colors"
                        title="Copier le numéro"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4 opacity-50" />
                        )}
                    </button>
                </div>

                <div className="flex gap-2 items-start text-xs opacity-90">
                    <span className="mt-0.5">⚠️</span>
                    <p>
                        Après le transfert, veuillez <strong>envoyer la capture d'écran du paiement sur WhatsApp</strong> au même numéro pour valider votre commande.
                    </p>
                </div>
            </div>
        </div>
    )
}
