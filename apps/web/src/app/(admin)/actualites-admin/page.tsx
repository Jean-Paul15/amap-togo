// Page admin de gestion des actualités
// Liste tous les articles avec édition inline

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { getAllActualites, deleteActualite, togglePublishStatus, type Actualite } from '@/lib/actions/actualites'
import { useToast } from '@/components/ui/toast'

export default function ActualitesAdminPage() {
    const toast = useToast()
    const [articles, setArticles] = useState<Actualite[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        loadArticles()
    }, [])

    const loadArticles = async () => {
        setLoading(true)
        const data = await getAllActualites()
        setArticles(data)
        setLoading(false)
    }

    const filteredArticles = articles.filter((article) =>
        article.titre.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id: string, titre: string) => {
        if (!confirm(`Supprimer l'article "${titre}" ?`)) return

        const result = await deleteActualite(id)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Article supprimé')
            setArticles(prev => prev.filter(a => a.id !== id))
        }
    }

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        const result = await togglePublishStatus(id, currentStatus)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(currentStatus ? 'Article dépublié' : 'Article publié')
            setArticles(prev => prev.map(a =>
                a.id === id ? { ...a, publie: !currentStatus } : a
            ))
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Actualités</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {articles.length} articles - Gérez vos actualités et événements
                    </p>
                </div>
                <Link
                    href="/actualites-admin/create"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nouvel article
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un article..."
                    className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 max-w-md"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/80">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Titre
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Catégorie
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Statut
                            </th>
                            <th className="w-32"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={5} className="px-4 py-3">
                                        <div className="h-12 bg-gray-50 rounded-lg animate-pulse" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredArticles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center">
                                    <p className="text-sm text-gray-500">Aucun article trouvé</p>
                                </td>
                            </tr>
                        ) : (
                            filteredArticles.map((article) => (
                                <tr key={article.id} className="group hover:bg-gray-50/50">
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-gray-900 text-sm line-clamp-2">
                                            {article.titre}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            {article.categorie}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-600">
                                            {formatDate(article.date_publication)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleTogglePublish(article.id, article.publie)}
                                            className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                        ${article.publie
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }
                      `}
                                        >
                                            {article.publie ? (
                                                <>
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Publié
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="w-3.5 h-3.5" />
                                                    Brouillon
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/actualites-admin/${article.id}/edit`}
                                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(article.id, article.titre)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
