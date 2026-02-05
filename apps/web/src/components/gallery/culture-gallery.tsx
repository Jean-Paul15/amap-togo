'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Image from 'next/image'
import type { GalleryMedia } from '@/lib/actions/gallery'

export function CultureGallery({ initialMedia }: { initialMedia: GalleryMedia[] }) {
    const [, setSelectedId] = useState<string | null>(null)

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {initialMedia.map((media, i) => (
                <motion.div
                    key={media.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => setSelectedId(media.id)}
                >
                    <div className="relative w-full">
                        {/* Aspect ratio managed by image intrinsic or css */}
                        {media.type === 'video' ? (
                            <div className="relative aspect-video bg-black/40 flex items-center justify-center border border-white/10 rounded-2xl">
                                <Play className="w-12 h-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white font-medium text-sm truncate">{media.title}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <Image
                                    src={media.url}
                                    alt={media.title || 'Culture'}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto rounded-2xl border border-white/5 group-hover:border-white/20 transition-all duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <p className="text-white font-medium text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {media.title}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}

            {initialMedia.length === 0 && (
                <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-3xl">
                    <p className="text-gray-500">La galerie est vide pour le moment.</p>
                </div>
            )}
        </div>
    )
}
