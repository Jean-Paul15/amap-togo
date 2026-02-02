'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getProductsForAdmin, getUsersForAdmin, createAdminOrder } from '@/lib/actions/admin-order'

interface Product {
    id: string
    nom: string
    prix: number
    unite?: string
}

interface User {
    id: string
    nom: string
    prenom: string
    telephone: string | null
}

export function CreateOrderForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Data
    const [products, setProducts] = useState<Product[]>([])
    const [users, setUsers] = useState<User[]>([])

    // Form State
    const [whatsappText, setWhatsappText] = useState('')
    const [selectedUser, setSelectedUser] = useState<string>('')
    const [manualUser, setManualUser] = useState({ nom: '', prenom: '', telephone: '', quartier: '' })
    const [cart, setCart] = useState<{ product: Product; qty: number }[]>([])
    const [note, setNote] = useState('')

    useEffect(() => {
        // Load data
        Promise.all([getProductsForAdmin(), getUsersForAdmin()]).then(([p, u]) => {
            setProducts(p as Product[])
            setUsers(u as User[])
        })
    }, [])

    // Parser simple
    const parseWhatsapp = () => {
        if (!whatsappText) return

        const lines = whatsappText.split('\n')
        const foundItems: { product: Product; qty: number }[] = []
        const usedProductIds = new Set<string>()

        lines.forEach(line => {
            const lowerLine = line.toLowerCase()
            // Chercher des nombres (quantité)
            const qtyMatch = lowerLine.match(/(\d+)/)
            const qty = qtyMatch ? parseInt(qtyMatch[0]) : 1

            // Chercher correspondance produit
            const matchedProduct = products.find(p => {
                const words = p.nom.toLowerCase().split(' ')
                // Si au moins un mot important du produit est dans la ligne
                return words.some(w => w.length > 3 && lowerLine.includes(w))
            })

            if (matchedProduct && !usedProductIds.has(matchedProduct.id)) {
                foundItems.push({ product: matchedProduct, qty })
                usedProductIds.add(matchedProduct.id)
            }
        })

        if (foundItems.length > 0) {
            setCart(prev => [...prev, ...foundItems])
            toast.success(`${foundItems.length} produits détectés`)
        } else {
            toast.info('Aucun produit détecté automatiquement. Veuillez les ajouter manuellement.')
        }
    }

    const addToCart = (productId: string) => {
        const p = products.find(x => x.id === productId)
        if (!p) return
        setCart(prev => [...prev, { product: p, qty: 1 }])
    }

    const updateQty = (index: number, newQty: number) => {
        const newCart = [...cart]
        newCart[index].qty = newQty
        setCart(newCart)
    }

    const removeLine = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index))
    }

    const total = cart.reduce((sum, item) => sum + (item.product.prix * item.qty), 0)

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await createAdminOrder({
                clientId: selectedUser === 'new' ? null : selectedUser,
                clientInfo: selectedUser === 'new' || !selectedUser ? manualUser : undefined,
                items: cart.map(i => ({ id: i.product.id, quantite: i.qty, prix: i.product.prix })),
                whatsappText,
                notes: note
            })

            if (res.success) {
                toast.success(`Commande ${res.numero} créée !`)
                router.push('/commandes')
            } else {
                toast.error(res.error)
            }
        } catch (e) {
            toast.error('Erreur')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne Gauche : WhatsApp & Client */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Import WhatsApp
                    </h3>
                    <textarea
                        value={whatsappText}
                        onChange={(e) => setWhatsappText(e.target.value)}
                        placeholder="Collez le message de la commande ici..."
                        className="w-full h-48 p-3 border rounded-lg text-sm mb-3 focus:ring-2 focus:ring-green-500/20 outline-none"
                    />
                    <button
                        onClick={parseWhatsapp}
                        className="w-full py-2 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Analyser le texte & Ajouter au panier
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Client
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Sélectionner un client existant</label>
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                            >
                                <option value="">-- Choisir --</option>
                                <option value="new">Nouveau / Anonyme</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.nom} {u.prenom} ({u.telephone})</option>
                                ))}
                            </select>
                        </div>

                        {(selectedUser === 'new' || !selectedUser) && (
                            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg border">
                                <input placeholder="Nom" className="p-2 border rounded" value={manualUser.nom} onChange={e => setManualUser({ ...manualUser, nom: e.target.value })} />
                                <input placeholder="Prénom" className="p-2 border rounded" value={manualUser.prenom} onChange={e => setManualUser({ ...manualUser, prenom: e.target.value })} />
                                <input placeholder="Téléphone" className="p-2 border rounded" value={manualUser.telephone} onChange={e => setManualUser({ ...manualUser, telephone: e.target.value })} />
                                <input placeholder="Quartier" className="p-2 border rounded" value={manualUser.quartier} onChange={e => setManualUser({ ...manualUser, quartier: e.target.value })} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Colonne Droite : Panier & Validation */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm h-full flex flex-col">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                        Contenu de la commande
                    </h3>

                    <div className="mb-4">
                        <select
                            className="w-full p-2 border rounded-lg mb-2"
                            onChange={(e) => {
                                addToCart(e.target.value)
                                e.target.value = ''
                            }}
                        >
                            <option value="">Ajouter un produit manuellement...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.nom} - {p.prix} FCFA</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-[300px]">
                        {cart.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg">
                                Panier vide
                            </div>
                        ) : (
                            <div className="divide-y">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-3">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product.nom}</p>
                                            <p className="text-xs text-muted-foreground">{item.product.prix.toLocaleString()} FCFA</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.qty}
                                                onChange={(e) => updateQty(idx, parseInt(e.target.value))}
                                                className="w-16 p-1 border rounded text-center"
                                            />
                                            <button onClick={() => removeLine(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center text-lg font-bold mb-4">
                            <span>Total</span>
                            <span>{total.toLocaleString()} FCFA</span>
                        </div>

                        <textarea
                            placeholder="Notes internes..."
                            className="w-full p-2 border rounded mb-4 text-sm h-20"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={loading || (cart.length === 0)}
                            className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Enregistrer la commande
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
