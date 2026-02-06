// Component to display list of articles
// Used on the public actualites page

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Tag, ArrowRight } from 'lucide-react'
import type { Actualite } from '@/lib/actions/actualites'
import { motion } from 'framer-motion'

interface ArticlesListProps {
    articles: Actualite[]
}

const categories = ['Tous', 'événement', 'produit', 'éducation', 'visite', 'général']

export function ArticlesList({ articles }: ArticlesListProps) {
    const [selectedCategory, setSelectedCategory] = useState('Tous')

    const filteredArticles = selectedCategory === 'Tous'
        ? articles
        : articles.filter(article => article.categorie === selectedCategory)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-10 sm:mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`
              px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium
              transition-all duration-300
              ${selectedCategory === cat
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                            }
            `}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredArticles.map((article, index) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
                        >
                            {/* Featured Image */}
                            {article.image_url && (
                                <div className="relative h-48 sm:h-56 overflow-hidden">
                                    <img
                                        src={article.image_url}
                                        alt={article.titre}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-5 sm:p-6">
                                {/* Meta */}
                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formatDate(article.date_publication)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Tag className="w-3.5 h-3.5" />
                                        {article.categorie}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                                    {article.titre}
                                </h2>

                                {/* Excerpt */}
                                {article.extrait && (
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                                        {article.extrait}
                                    </p>
                                )}

                                {/* Read More Link */}
                                <Link
                                    href={`/actualites/${article.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors"
                                >
                                    Lire la suite
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-400 text-lg">
                        Aucun article dans cette catégorie pour le moment.
                    </p>
                </div>
            )}
        </>
    )
}
