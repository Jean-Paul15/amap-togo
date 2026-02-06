// Formulaire de création/édition d'article
// Composant réutilisable pour create et edit

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Upload, X } from 'lucide-react'
import { generateSlug } from '@/lib/utils/slug'
import { supabaseClient } from '@/lib/supabase'

interface ArticleFormProps {
    initialData?: {
        titre: string
        slug: string
        contenu: string
        extrait: string
        image_url: string
        categorie: string
        publie: boolean
    }
    onSubmit: (data: {
        titre: string
        slug: string
        contenu: string
        extrait: string
        image_url: string
        categorie: string
        publie: boolean
    }) => Promise<void>
    saving: boolean
}

const categories = ['général', 'événement', 'produit', 'éducation', 'visite']

export function ArticleForm({ initialData, onSubmit, saving }: ArticleFormProps) {
    const [titre, setTitre] = useState(initialData?.titre || '')
    const [slug, setSlug] = useState(initialData?.slug || '')
    const [contenu, setContenu] = useState(initialData?.contenu || '')
    const [extrait, setExtrait] = useState(initialData?.extrait || '')
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')
    const [categorie, setCategorie] = useState(initialData?.categorie || 'général')
    const [publie, setPublie] = useState(initialData?.publie || false)
    const [uploading, setUploading] = useState(false)

    // Auto-generate slug from title
    useEffect(() => {
        if (!initialData && titre) {
            setSlug(generateSlug(titre))
        }
    }, [titre, initialData])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('Fichier non valide')
            return
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Image trop volumineuse (max 2Mo)')
            return
        }

        setUploading(true)

        try {
            const ext = file.name.split('.').pop()
            const fileName = `${Date.now()}.${ext}`
            const filePath = `actualites/${fileName}`

            const { error: uploadError } = await supabaseClient.storage
                .from('images')
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            const { data: urlData } = supabaseClient.storage
                .from('images')
                .getPublicUrl(filePath)

            setImageUrl(urlData.publicUrl)
        } catch (err) {
            console.error('Erreur upload:', err)
            alert('Erreur lors de l\'upload')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!titre || !contenu) {
            alert('Veuillez remplir tous les champs obligatoires')
            return
        }

        await onSubmit({
            titre,
            slug,
            contenu,
            extrait,
            image_url: imageUrl,
            categorie,
            publie,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                {/* Titre */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Titre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                        placeholder="Titre de l'article"
                        required
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        URL (slug)
                    </label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono text-sm"
                        placeholder="url-de-larticle"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        URL: /actualites/{slug || 'url-de-larticle'}
                    </p>
                </div>

                {/* Catégorie */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Catégorie
                    </label>
                    <select
                        value={categorie}
                        onChange={(e) => setCategorie(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Image */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Image à la une
                    </label>
                    {imageUrl ? (
                        <div className="relative">
                            <img
                                src={imageUrl}
                                alt="Preview"
                                className="w-full h-64 object-cover rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={() => setImageUrl('')}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                                {uploading ? 'Upload en cours...' : 'Cliquez pour uploader une image'}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                    )}
                </div>

                {/* Extrait */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Extrait
                    </label>
                    <textarea
                        value={extrait}
                        onChange={(e) => setExtrait(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
                        placeholder="Résumé court de l'article (optionnel)"
                    />
                </div>

                {/* Contenu */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contenu <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={contenu}
                        onChange={(e) => setContenu(e.target.value)}
                        rows={15}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none font-mono text-sm"
                        placeholder="Contenu de l'article..."
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Utilisez des sauts de ligne pour séparer les paragraphes
                    </p>
                </div>

                {/* Publier */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="publie"
                        checked={publie}
                        onChange={(e) => setPublie(e.target.checked)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="publie" className="text-sm font-medium text-gray-700">
                        Publier immédiatement
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Link
                    href="/actualites-admin"
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </Link>
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    )
}
