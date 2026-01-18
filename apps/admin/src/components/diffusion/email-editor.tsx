// Editeur d'email simple et leger avec react-simple-wysiwyg
// Sans problemes SSR, leger et fiable

'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Import dynamique pour eviter les problemes SSR
const DefaultEditor = dynamic(() => import('react-simple-wysiwyg').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Chargement de l'éditeur...</p>
        </div>
      </div>
    </div>
  )
})

interface EmailEditorProps {
  value: string
  onChange: (value: string) => void
}

export function EmailEditor({ value, onChange }: EmailEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Chargement de l'éditeur...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="email-editor-wrapper">
      <DefaultEditor
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rédigez votre message ici..."
        containerProps={{
          style: {
            minHeight: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white'
          }
        }}
      />
    </div>
  )
}
