// Store Zustand pour le panier et le POS
// Gere l'etat du panier et du modal POS

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Section active du POS */
type POSSection = 'produits' | 'panier' | 'paiement'

/** Article dans le panier */
interface CartItem {
  id: string
  type: 'produit' | 'panier'
  nom: string
  prix: number
  quantite: number
  unite?: string
  imageUrl?: string
}

/** Etat du store panier et POS */
interface CartState {
  // Panier
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantite'>) => void
  addPanier: (panier: { id: string; nom: string; prix: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantite: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  // Modal POS
  isModalOpen: boolean
  activeSection: POSSection
  openModal: () => void
  closeModal: () => void
  setActiveSection: (section: POSSection) => void
}

/**
 * Store panier avec persistance localStorage
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantite: i.quantite + 1 } : i
              ),
            }
          }

          return { items: [...state.items, { ...item, quantite: 1 }] }
        })
      },

      addPanier: (panier) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === panier.id)

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === panier.id ? { ...i, quantite: i.quantite + 1 } : i
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                id: panier.id,
                type: 'panier' as const,
                nom: panier.nom,
                prix: panier.prix,
                quantite: 1,
              },
            ],
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },

      updateQuantity: (id, quantite) => {
        if (quantite <= 0) {
          get().removeItem(id)
          return
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantite } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantite, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.prix * item.quantite,
          0
        )
      },

      // Modal POS
      isModalOpen: false,
      activeSection: 'produits',

      openModal: () => set({ isModalOpen: true }),
      
      closeModal: () => set({ isModalOpen: false, activeSection: 'produits' }),
      
      setActiveSection: (section) => set({ activeSection: section }),
    }),
    {
      name: 'amap-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
