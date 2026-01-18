// Composant Badge pour les statuts

import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
}

/**
 * Badge de statut compact
 */
export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2 py-0.5
        text-xs font-medium
        rounded-full
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
