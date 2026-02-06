'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import type { GalleryMedia } from '@/lib/actions/gallery'

export function CultureGallery({ initialMedia }: { initialMedia: GalleryMedia[] }) {
    const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null)
    const [zoom, setZoom] = useState(1)
    const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedMedia) return

            if (e.key === 'Escape') {
                setSelectedMedia(null)
                setZoom(1)
            } else if (e.key === 'ArrowLeft') {
                navigateMedia('prev')
            } else if (e.key === 'ArrowRight') {
                navigateMedia('next')
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedMedia])

    const navigateMedia = (direction: 'prev' | 'next') => {
        if (!selectedMedia) return
        const currentIndex = initialMedia.findIndex(m => m.id === selectedMedia.id)
        const newIndex = direction === 'prev'
            ? (currentIndex - 1 + initialMedia.length) % initialMedia.length
            : (currentIndex + 1) % initialMedia.length
        setSelectedMedia(initialMedia[newIndex])
        setZoom(1)
    }

    const handleVideoHover = (mediaId: string, isHovering: boolean) => {
        const video = videoRefs.current[mediaId]
        if (!video) return

        if (isHovering) {
            setHoveredVideo(mediaId)
            video.play().catch(() => {
                // Ignore autoplay errors
            })
        } else {
            setHoveredVideo(null)
            video.pause()
            video.currentTime = 0
        }
    }

    return (
        <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {initialMedia.map((media, i) => (
                    <motion.div
                        key={media.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer"
                        onClick={() => media.type === 'image' && setSelectedMedia(media)}
                        onMouseEnter={() => media.type === 'video' && handleVideoHover(media.id, true)}
                        onMouseLeave={() => media.type === 'video' && handleVideoHover(media.id, false)}
                    >
                        <div className="relative w-full">
                            {media.type === 'video' ? (
                                <div className="relative aspect-video bg-black/40 rounded-2xl overflow-hidden border border-white/10">
                                    <video
                                        ref={(el) => { if (el) videoRefs.current[media.id] = el }}
                                        src={media.url}
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                        playsInline
                                    />
                                    {hoveredVideo !== media.id && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <Play className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-white font-medium text-sm truncate drop-shadow-lg">
                                            {media.title}
                                        </p>
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 rounded-2xl">
                                        <p className="text-white font-medium text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {media.title}
                                        </p>
                                        <p className="text-white/70 text-sm mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            Cliquer pour agrandir
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

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedMedia && selectedMedia.type === 'image' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={() => {
                            setSelectedMedia(null)
                            setZoom(1)
                        }}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedMedia(null)
                                setZoom(1)
                            }}
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Zoom controls */}
                        <div className="absolute top-4 left-4 flex gap-2 z-10">
                            <button
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setZoom(Math.min(zoom + 0.5, 3))
                                }}
                            >
                                <ZoomIn className="w-5 h-5 text-white" />
                            </button>
                            <button
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setZoom(Math.max(zoom - 0.5, 1))
                                }}
                            >
                                <ZoomOut className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Navigation arrows */}
                        {initialMedia.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigateMedia('prev')
                                    }}
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigateMedia('next')
                                    }}
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </>
                        )}

                        {/* Image */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-7xl max-h-[90vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedMedia.url}
                                alt={selectedMedia.title || 'Culture'}
                                width={1920}
                                height={1080}
                                className="w-auto h-auto max-w-full max-h-[90vh] object-contain transition-transform duration-300"
                                style={{ transform: `scale(${zoom})` }}
                            />
                            {selectedMedia.title && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <p className="text-white text-xl font-medium">{selectedMedia.title}</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Instructions */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm flex gap-4">
                            <span>ESC pour fermer</span>
                            <span>← → pour naviguer</span>
                            <span>Molette pour zoomer</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
