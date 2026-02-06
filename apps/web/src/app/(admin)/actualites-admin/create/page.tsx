// Page de création d'un nouvel article
// Formulaire avec éditeur de texte

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createActualite } from '@/lib/actions/actualites'
import { useToast } from '@/components/ui/toast'
import { ArticleForm } from '@/components/admin/actualites/article-form'

export default function CreateActualitePage() {
    const router = useRouter()
    const toast = useToast()
    const [saving, setSaving] = useState(false)

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

        const result = await createActualite(data)

        if (result.error) {
            toast.error(result.error)
            setSaving(false)
        } else {
            toast.success('Article créé avec succès')
            router.push('/actualites-admin')
        }
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
                        <h1 className="text-2xl font-bold text-gray-900">Nouvel article</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Créez un nouvel article pour vos actualités
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <ArticleForm onSubmit={handleSubmit} saving={saving} />
        </div>
    )
}
