// Toggle de statut actif/inactif
// Clic direct pour basculer

'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusToggleProps {
  actif: boolean
  onToggle: () => Promise<boolean>
}

/**
 * Toggle de statut actif/inactif
 */
export function StatusToggle({ actif, onToggle }: StatusToggleProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    await onToggle()
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer',
        actif
          ? 'bg-green-50 text-green-600 ring-1 ring-green-100 hover:bg-green-100'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      )}
      title="Cliquer pour changer le statut"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        actif ? 'Actif' : 'Inactif'
      )}
    </button>
  )
}
