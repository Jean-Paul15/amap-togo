// Composant upload image produit
// Gere le preview et l'upload vers Supabase Storage

'use client'

import { useRef } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string) => void
  onUpload: (file: File) => Promise<string | null>
  uploading: boolean
  className?: string
}

/**
 * Composant pour uploader une image produit
 */
export function ImageUpload({
  value,
  onChange,
  onUpload,
  uploading,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await onUpload(file)
    if (url) {
      onChange(url)
    }

    // Reset input pour permettre de re-selectionner le meme fichier
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {value ? (
        // Affichage de l'image
        <div className="relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={value}
            alt="Image produit"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ) : (
        // Zone de drop / selection
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'w-full aspect-video flex flex-col items-center justify-center gap-2',
            'bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg',
            'hover:bg-gray-100 hover:border-gray-300 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              <span className="text-sm text-gray-500">Upload en cours...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-700">
                  Ajouter une image
                </span>
                <p className="text-xs text-gray-400 mt-0.5">
                  JPG, PNG, WebP ou GIF (max 5 Mo)
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                <Upload className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">
                  Parcourir
                </span>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  )
}
