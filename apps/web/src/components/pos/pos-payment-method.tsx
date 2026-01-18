// Choix de la methode de paiement
// Especes, Mixx By Yas, Flooz

'use client'

import Image from 'next/image'
import { Banknote } from 'lucide-react'
import type { PaymentMethodType } from './pos-checkout'

interface PaymentMethodConfig {
  id: PaymentMethodType
  label: string
  description: string
  icon?: typeof Banknote
  image?: string
}

const paymentMethods: PaymentMethodConfig[] = [
  {
    id: 'especes',
    label: 'Especes',
    description: 'Paiement a la livraison',
    icon: Banknote,
  },
  {
    id: 'mixx',
    label: 'Mixx By Yas',
    description: 'Paiement mobile',
    image: '/images/payment/mixx.png',
  },
  {
    id: 'flooz',
    label: 'Flooz',
    description: 'Paiement mobile Moov',
    image: '/images/payment/flooz.png',
  },
]

interface POSPaymentMethodProps {
  selected: PaymentMethodType
  onSelect: (method: PaymentMethodType) => void
}

/**
 * Selection de la methode de paiement
 */
export function POSPaymentMethod({ selected, onSelect }: POSPaymentMethodProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">
        Methode de paiement
      </h4>

      <div className="space-y-2">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          const isSelected = selected === method.id

          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg
                border transition-colors text-left
                ${isSelected
                  ? 'border-primary bg-accent'
                  : 'border-border bg-background hover:border-primary/50'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center overflow-hidden
                ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}
              `}>
                {method.image ? (
                  <Image
                    src={method.image}
                    alt={method.label}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : Icon ? (
                  <Icon className="w-5 h-5" />
                ) : null}
              </div>
              <div className="flex-1">
                <span className="block text-sm font-medium text-foreground">
                  {method.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {method.description}
                </span>
              </div>
              {/* Radio indicator */}
              <div className={`
                w-5 h-5 rounded-full border-2
                flex items-center justify-center
                ${isSelected ? 'border-primary' : 'border-border'}
              `}>
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
