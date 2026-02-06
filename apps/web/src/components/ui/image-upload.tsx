'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Loader2, Camera, UploadCloud } from 'lucide-react'
import { toast } from 'sonner'
import { updateSiteAsset } from '@/lib/actions/settings'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
    currentImageUrl?: string
    settingKey: 'site_logo_url' | 'site_hero_url' | 'site_bg_image_url' | 'site_bg_video_url'
    label: string
    aspectRatio?: 'square' | 'video' | 'auto'
    className?: string
}

export function ImageUpload({
    currentImageUrl,
    settingKey,
    label,
    aspectRatio = 'auto',
    className
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    // Optimistic UI: show uploaded image immediately
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const displayUrl = previewUrl || currentImageUrl

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Local preview
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)
        setUploading(true)

        const fd = new FormData()
        fd.append('file', file)

        const res = await updateSiteAsset(fd, settingKey)

        if (res.success) {
            toast.success('Image mise à jour avec succès')
        } else {
            toast.error(res.error || 'Erreur lors de l\'upload')
            setPreviewUrl(null) // Revert on error
        }
        setUploading(false)
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className={cn("space-y-3", className)}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            <div
                onClick={handleClick}
                className={cn(
                    "relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-emerald-500 transition-colors bg-gray-50",
                    aspectRatio === 'square' ? "w-32 h-32" :
                        aspectRatio === 'video' ? "aspect-video w-full max-w-sm" :
                            "w-full h-48"
                )}
            >
                {displayUrl ? (
                    <Image
                        src={displayUrl}
                        alt="Preview"
                        fill
                        className="object-contain p-2"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                        <UploadCloud className="w-8 h-8" />
                        <span className="text-xs">Cliquer pour modifier</span>
                    </div>
                )}

                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                </div>

                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}
