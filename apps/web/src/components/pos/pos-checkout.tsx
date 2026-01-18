// Section Paiement du POS
// Formulaire livraison, choix paiement, confirmation

'use client'

import { useState, useRef } from 'react'
import { formatPrice } from '@amap-togo/utils'
import { createClientBrowser } from '@amap-togo/database/browser'
import { useCartStore } from '@/stores/cart-store'
import { generateFacture } from '@/lib/facture'
import type { FactureItem } from '@/lib/facture'
import { POSDeliveryForm } from './pos-delivery-form'
import { POSPaymentMethod } from './pos-payment-method'
import { POSOrderConfirmation } from './pos-order-confirmation'

export type PaymentMethodType = 'especes' | 'mixx' | 'flooz'

interface DeliveryInfo {
  nom: string
  prenom: string
  telephone: string
  quartier: string
  adresse: string
  notes: string
}

/**
 * Section Paiement du modal POS
 */
export function POSCheckout() {
  const { items, getTotalPrice, clearCart, closeModal } = useCartStore()
  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    nom: '',
    prenom: '',
    telephone: '',
    quartier: '',
    adresse: '',
    notes: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('especes')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sauvegarder les items pour la facture (avant clearCart)
  const savedItemsRef = useRef<FactureItem[]>([])
  const savedTotalRef = useRef<number>(0)

  const totalPrice = getTotalPrice()

  // Validation du formulaire - telephone doit avoir 8 chiffres
  const isFormValid = 
    deliveryInfo.nom.trim() !== '' &&
    deliveryInfo.prenom.trim() !== '' &&
    deliveryInfo.telephone.trim().length === 8 &&
    deliveryInfo.quartier.trim() !== ''

  // Soumettre la commande (sans authentification requise)
  const handleSubmit = async () => {
    if (!isFormValid || items.length === 0) return

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClientBrowser()
      
      // Preparer les items pour le RPC (JSONB)
      const orderItems = items.map((item) => ({
        id: item.id,
        type: item.type,
        quantite: item.quantite,
        prix: item.prix,
      }))

      // Appeler le RPC pour commande anonyme
      // Le RPC retourne JSONB, on cast le resultat
      interface RpcResult { 
        success: boolean
        numero?: string
        error?: string 
      }
      
      // Cast explicite pour contourner les types generes
      type RpcClient = {
        rpc: (
          fn: string,
          params: Record<string, unknown>
        ) => Promise<{ data: unknown; error: { message: string } | null }>
      }
      
      const { data, error: rpcError } = await (supabase as unknown as RpcClient).rpc(
        'create_anonymous_order',
        {
          p_nom: deliveryInfo.nom,
          p_prenom: deliveryInfo.prenom,
          p_telephone: deliveryInfo.telephone,
          p_quartier: deliveryInfo.quartier,
          p_adresse: deliveryInfo.adresse || null,
          p_notes: deliveryInfo.notes || null,
          p_methode_paiement: paymentMethod,
          p_items: orderItems,
        }
      )

      const result = data as RpcResult | null

      if (rpcError) {
        console.error('Erreur RPC:', rpcError)
        setError('Erreur lors de la commande')
        return
      }

      if (result?.success && result?.numero) {
        // Sauvegarder les items avant de vider le panier
        savedItemsRef.current = items.map((item) => ({
          nom: item.nom,
          quantite: item.quantite,
          prixUnitaire: item.prix,
          prixTotal: item.prix * item.quantite,
        }))
        savedTotalRef.current = totalPrice

        // Generer et telecharger la facture
        generateFacture({
          numeroCommande: result.numero,
          dateCommande: new Date(),
          client: {
            nom: deliveryInfo.nom,
            telephone: deliveryInfo.telephone,
            quartier: deliveryInfo.quartier,
            adresse: deliveryInfo.adresse || undefined,
          },
          items: savedItemsRef.current,
          total: savedTotalRef.current,
          methodePaiement: paymentMethod,
        })

        setOrderNumber(result.numero)
        setStep('confirm')
        clearCart()
      } else {
        setError(result?.error || 'Erreur lors de la commande')
      }
    } catch (err) {
      console.error('Erreur commande:', err)
      setError('Erreur de connexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Re-telecharger la facture
  const handleDownloadFacture = () => {
    if (!orderNumber) return
    
    generateFacture({
      numeroCommande: orderNumber,
      dateCommande: new Date(),
      client: {
        nom: deliveryInfo.nom,
        telephone: deliveryInfo.telephone,
        quartier: deliveryInfo.quartier,
        adresse: deliveryInfo.adresse || undefined,
      },
      items: savedItemsRef.current,
      total: savedTotalRef.current,
      methodePaiement: paymentMethod,
    })
  }

  // Panier vide
  if (items.length === 0 && step !== 'confirm') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground text-center">
          Ajoutez des produits au panier pour passer commande
        </p>
      </div>
    )
  }

  // Confirmation
  if (step === 'confirm' && orderNumber) {
    return (
      <POSOrderConfirmation
        orderNumber={orderNumber}
        onClose={closeModal}
        onDownloadFacture={handleDownloadFacture}
      />
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Titre */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-foreground">
          Paiement
        </h3>
      </div>

      {/* Formulaire scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Formulaire livraison */}
        <POSDeliveryForm
          values={deliveryInfo}
          onChange={setDeliveryInfo}
        />

        {/* Note livraison */}
        <p className="text-xs text-muted-foreground bg-accent/50 p-3 rounded-lg">
          Les frais de livraison seront communiqués par le livreur selon votre quartier.
        </p>

        {/* Methode de paiement */}
        <POSPaymentMethod
          selected={paymentMethod}
          onSelect={setPaymentMethod}
        />

        {/* Message d'erreur */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Resume et bouton */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">Total a payer</span>
          <span className="text-xl font-bold text-foreground">
            {formatPrice(totalPrice)}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="
            w-full py-3 bg-primary text-primary-foreground
            rounded-lg font-medium
            hover:bg-primary/90 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
        </button>
      </div>
    </div>
  )
}
