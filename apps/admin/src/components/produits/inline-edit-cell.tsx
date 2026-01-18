// Cellule editable inline pour la table produits
// Permet de modifier directement en cliquant

'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InlineEditCellProps {
  value: string | number
  onSave: (newValue: string | number) => Promise<boolean>
  type?: 'text' | 'number' | 'select'
  options?: { value: string; label: string }[]
  formatDisplay?: (value: string | number) => string
  className?: string
}

/**
 * Cellule editable inline
 */
export function InlineEditCell({
  value,
  onSave,
  type = 'text',
  options,
  formatDisplay,
  className,
}: InlineEditCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  const handleSave = async () => {
    if (editValue === String(value)) {
      setIsEditing(false)
      return
    }

    setSaving(true)
    const newValue = type === 'number' ? Number(editValue) : editValue
    const success = await onSave(newValue)
    setSaving(false)

    if (success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(String(value))
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        {type === 'select' && options ? (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            disabled={saving}
            className="px-2 py-1 text-sm border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={saving}
            className="w-full px-2 py-1 text-sm border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="p-1 text-green-600 hover:bg-green-50 rounded"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="p-1 text-gray-400 hover:bg-gray-100 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={cn(
        'text-left hover:bg-green-50 hover:text-green-700 px-2 py-1 -mx-2 rounded-lg transition-colors cursor-pointer',
        className
      )}
      title="Cliquer pour modifier"
    >
      {formatDisplay ? formatDisplay(value) : value}
    </button>
  )
}
