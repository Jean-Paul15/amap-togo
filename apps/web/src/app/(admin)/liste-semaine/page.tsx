// Page admin pour gérer la liste des produits de la semaine
// L'admin peut coller un message WhatsApp qui s'affichera sur la page d'accueil

'use client'

import { useEffect, useState } from 'react'
import { ClipboardList, Save, Trash2, Eye, Calendar, Plus } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import {
    getAllListesProduits,
    createListeProduits,
    updateListeProduits,
    deleteListeProduits,
    activateListeProduits,
    type ListeProduits
} from '@/lib/actions/liste-produits'

export const dynamic = 'force-dynamic'

export default function ListeSemainePage() {
    const toast = useToast()
    const [listes, setListes] = useState<ListeProduits[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [contenu, setContenu] = useState('')

    useEffect(() => {
        loadListes()
    }, [])

    const loadListes = async () => {
        const data = await getAllListesProduits()
        setListes(data)
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!contenu.trim()) {
            toast.error('Le contenu ne peut pas être vide')
            return
        }

        setSaving(true)
        try {
            if (editingId) {
                const result = await updateListeProduits(editingId, { contenu })
                if (result.error) throw new Error(result.error)
                toast.success('Liste modifiée')
            } else {
                const result = await createListeProduits({ contenu, actif: true })
                if (result.error) throw new Error(result.error)
                toast.success('Liste publiée')
            }

            setContenu('')
            setEditingId(null)
            setShowForm(false)
            loadListes()
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors de l\'enregistrement')
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (liste: ListeProduits) => {
        setContenu(liste.contenu)
        setEditingId(liste.id)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cette liste ?')) return

        const result = await deleteListeProduits(id)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Liste supprimée')
            loadListes()
        }
    }

    const handleActivate = async (id: string) => {
        const result = await activateListeProduits(id)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Liste activée')
            loadListes()
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Liste de la semaine</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Collez le message WhatsApp ou la liste des produits disponibles
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm)
                        setEditingId(null)
                        setContenu('')
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle liste
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contenu de la liste
                            </label>
                            <textarea
                                value={contenu}
                                onChange={(e) => setContenu(e.target.value)}
                                rows={12}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                                placeholder="Collez ici le message WhatsApp ou la liste des produits...

Exemple:
🥬 Laitue - 500 FCFA
🥕 Carottes - 300 FCFA/kg
🍅 Tomates - 400 FCFA/kg
🥒 Concombres - 250 FCFA
..."
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                {contenu.length} caractères
                            </p>
                        </div>

                        {/* Preview */}
                        {contenu && (
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu</h3>
                                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm">
                                    {contenu}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false)
                                    setContenu('')
                                    setEditingId(null)
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Publier'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* List of previous weeks */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Historique</h2>
                </div>

                {loading ? (
                    <div className="p-6 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-50 rounded animate-pulse" />
                        ))}
                    </div>
                ) : listes.length === 0 ? (
                    <div className="p-12 text-center">
                        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Aucune liste créée</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {listes.map((liste) => (
                            <div
                                key={liste.id}
                                className="p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${liste.actif
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {liste.actif ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(liste.date_publication)}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 whitespace-pre-wrap text-sm text-gray-700 max-h-32 overflow-y-auto">
                                            {liste.contenu}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {!liste.actif && (
                                            <button
                                                onClick={() => handleActivate(liste.id)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                                title="Activer"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEdit(liste)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                            title="Modifier"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(liste.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
