// Composant d'edition d'image inline pour les produits
// Permet de modifier l'image directement sur la liste

'use client'

import { useState, useRef } from 'react'
import { Camera, X, Loader2, ImageOff } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface InlineImageEditProps {
  /** URL de l'image actuelle */
  imageUrl: string | null
  /** Nom du produit pour l'alt */
  productName: string
  /** ID du produit */
  productId: string
  /** Callback apres mise a jour */
  onUpdate: (newUrl: string) => void
  /** Taille de l'image */
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
}

/**
 * Edition d'image inline pour les produits
 * Cliquer sur l'image ouvre le selecteur de fichier
 */
export function InlineImageEdit({
  imageUrl,
  productName,
  productId,
  onUpdate,
  size = 'sm',
}: InlineImageEditProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Gere l'upload de l'image
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation du type
    if (!file.type.startsWith('image/')) {
      setError('Fichier non valide')
      return
    }

    // Validation de la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image trop volumineuse (max 2Mo)')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Generer un nom unique
      const ext = file.name.split('.').pop()
      const fileName = `${productId}-${Date.now()}.${ext}`
      const filePath = `produits/${fileName}`

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabaseClient.storage
        .from('images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Obtenir l'URL publique
      const { data: urlData } = supabaseClient.storage
        .from('images')
        .getPublicUrl(filePath)

      const newUrl = urlData.publicUrl

      // Mettre a jour le produit en base
      const { error: updateError } = await supabaseClient
        .from('produits')
        .update({ image_url: newUrl })
        .eq('id', productId)

      if (updateError) throw updateError

      // Notifier le parent
      onUpdate(newUrl)
    } catch (err) {
      console.error('Erreur upload:', err)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any)?.message || 'Erreur lors de l\'upload'
      setError(errorMessage)
    } finally {
      setUploading(false)
      // Reset l'input pour permettre de re-selectionner le meme fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="relative group">
      {/* Input file cache */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Zone cliquable */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={cn(
          'relative overflow-hidden rounded-lg bg-gray-100 transition-all',
          'hover:ring-2 hover:ring-green-500/50 hover:ring-offset-1',
          'focus:outline-none focus:ring-2 focus:ring-green-500',
          sizeClasses[size],
          uploading && 'pointer-events-none opacity-70'
        )}
        title="Cliquer pour modifier l'image"
      >
        {/* Image ou placeholder */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-4 h-4 text-gray-300" />
          </div>
        )}

        {/* Overlay au hover */}
        <div className={cn(
          'absolute inset-0 bg-black/50 flex items-center justify-center',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          uploading && 'opacity-100'
        )}>
          {uploading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Camera className="w-4 h-4 text-white" />
          )}
        </div>
      </button>

      {/* Message d'erreur */}
      {error && (
        <div className="absolute top-full left-0 mt-1 z-10">
          <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="p-0.5 hover:bg-red-100 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
