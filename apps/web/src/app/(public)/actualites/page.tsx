// Page publique des actualités
// Affiche la liste des articles publiés

import type { Metadata } from 'next'
import { getPublishedActualites } from '@/lib/actions/actualites'
import { ArticlesList } from '@/components/actualites/articles-list'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Actualités - AMAP TOGO',
    description: 'Découvrez les dernières actualités, événements et nouvelles de l\'AMAP TOGO. Restez informé de nos activités, visites de ferme et produits de saison.',
}

export default async function ActualitesPage() {
    const articles = await getPublishedActualites()

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1f12] to-[#0f2818] py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Actualités
                    </h1>
                    <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
                        Découvrez les dernières nouvelles, événements et actualités de l'AMAP TOGO
                    </p>
                </div>

                {/* Articles List */}
                <ArticlesList articles={articles} />
            </div>
        </div>
    )
}
