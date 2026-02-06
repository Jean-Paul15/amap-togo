// Page d'édition d'un article existant
// Utilise le même formulaire que la page de création

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { updateActualite, getAllActualites, type Actualite } from '@/lib/actions/actualites'
import { useToast } from '@/components/ui/toast'
import { ArticleForm } from '@/components/admin/actualites/article-form'

interface EditActualitePageProps {
    params: { id: string }
}

export default function EditActualitePage({ params }: EditActualitePageProps) {
    const router = useRouter()
    const toast = useToast()
    const [article, setArticle] = useState<Actualite | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadArticle()
    }, [params.id])

    const loadArticle = async () => {
        const articles = await getAllActualites()
        const found = articles.find(a => a.id === params.id)
        setArticle(found || null)
        setLoading(false)
    }

    const handleSubmit = async (data: {
        titre: string
        slug: string
        contenu: string
        extrait: string
        image_url: string
        categorie: string
        publie: boolean
    }) => {
        setSaving(true)

        const result = await updateActualite(params.id, data)

        if (result.error) {
            toast.error(result.error)
            setSaving(false)
        } else {
            toast.success('Article modifié avec succès')
            router.push('/actualites-admin')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Chargement...</div>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Article non trouvé</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/actualites-admin"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Modifier l'article</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {article.titre}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <ArticleForm
                initialData={{
                    titre: article.titre,
                    slug: article.slug,
                    contenu: article.contenu,
                    extrait: article.extrait || '',
                    image_url: article.image_url || '',
                    categorie: article.categorie,
                    publie: article.publie,
                }}
                onSubmit={handleSubmit}
                saving={saving}
            />
        </div>
    )
}
