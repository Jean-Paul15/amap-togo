'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Trash2, Plus, Video, Loader2, Save } from 'lucide-react'
import { Button, Input, Card } from '@amap-togo/ui'
import { getGalleryMedia, addGalleryMedia, deleteGalleryMedia, uploadGalleryMediaAction, type GalleryMedia } from '@/lib/actions/gallery'
import Image from 'next/image'

export default function AdminGalleryPage() {
    const [mediaList, setMediaList] = useState<GalleryMedia[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newUrl, setNewUrl] = useState('')
    const [newTitle, setNewTitle] = useState('')
    const [newType, setNewType] = useState<'image' | 'video'>('image')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Chargement initial
    useEffect(() => {
        loadMedia()
    }, [])

    async function loadMedia() {
        setIsLoading(true)
        const data = await getGalleryMedia()
        setMediaList(data)
        setIsLoading(false)
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault()
        if (!newUrl) return

        setIsSubmitting(true)
        try {
            await addGalleryMedia(newUrl, newTitle, newType)
            await loadMedia()
            setNewUrl('')
            setNewTitle('')
            // Feedback success (simple log for now)
            console.log('Media added')
        } catch (error: any) {
            console.error(error)
            alert("Erreur lors de l'ajout: " + (error.message || "Inconnue"))
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete(media: GalleryMedia) {
        if (!confirm('Supprimer cet élément ?')) return
        try {
            setMediaList(prev => prev.filter(m => m.id !== media.id)) // Optimistic UI

            // La suppression du storage est maintenant gérée côté serveur dans deleteGalleryMedia
            await deleteGalleryMedia(media.id)
        } catch (error) {
            console.error(error)
            alert("Erreur suppression")
            loadMedia() // Rollback if error
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Galerie "Nos Cultures"</h1>
                    <p className="text-gray-500">Gérez les photos et vidéos de la page publique.</p>
                </div>
            </div>

            {/* Formulaire d'ajout rapide */}
            <Card className="p-6 bg-white shadow-sm border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" /> Ajouter un média
                </h2>
                <form onSubmit={handleAdd} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase block">Fichier local (Image/Vidéo)</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return

                                        setIsSubmitting(true)
                                        try {
                                            const formData = new FormData()
                                            formData.append('file', file)

                                            // Utilisation de l'action serveur pour contourner RLS
                                            const publicUrl = await uploadGalleryMediaAction(formData)

                                            setNewUrl(publicUrl)
                                            setNewType(file.type.startsWith('video') ? 'video' : 'image')
                                            if (!newTitle) setNewTitle(file.name.split('.')[0])
                                        } catch (err: any) {
                                            console.error(err)
                                            alert("Erreur upload: " + (err.message || "Inconnue"))
                                        } finally {
                                            setIsSubmitting(false)
                                        }
                                    }}
                                    disabled={isSubmitting}
                                    className="cursor-pointer"
                                />
                                {newUrl && <span className="text-xs text-green-600 font-medium">Prêt !</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase block">Ou lien externe (URL)</label>
                            <Input
                                placeholder="https://..."
                                value={newUrl}
                                onChange={e => setNewUrl(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Titre (Optionnel)</label>
                            <Input
                                placeholder="Ex: Notre équipe au champ..."
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Type</label>
                            <select
                                className="w-full border rounded-md px-3 py-2 text-sm bg-background disabled:opacity-50"
                                value={newType}
                                onChange={(e) => setNewType(e.target.value as 'image' | 'video')}
                                disabled={isSubmitting}
                            >
                                <option value="image">Image</option>
                                <option value="video">Vidéo</option>
                            </select>
                        </div>
                        <Button type="submit" disabled={isSubmitting || !newUrl} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-8">
                            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4 mr-2" />}
                            Enregistrer dans la galerie
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Grille des médias */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-400">Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {mediaList.map((media) => (
                            <motion.div
                                key={media.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                {/* Preview */}
                                <div className="aspect-video relative bg-gray-100">
                                    {media.type === 'video' ? (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Video className="w-12 h-12" />
                                            {/* On pourrait mettre un iframe ou video tag si l'URL est directe */}
                                        </div>
                                    ) : (
                                        <Image
                                            src={media.url}
                                            alt={media.title || 'Galerie'}
                                            fill
                                            className="object-cover"
                                        />
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleDelete(media)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <p className="font-medium truncate text-gray-900">{media.title || 'Sans titre'}</p>
                                    <p className="text-xs text-gray-400 truncate mt-1">{media.url}</p>
                                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-gray-100 text-gray-500">
                                        {media.type}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {mediaList.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun média dans la galerie.</p>
                </div>
            )}

        </div>
    )
}
