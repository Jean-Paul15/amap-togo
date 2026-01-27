// Badge de statut d'email
// Affiche le statut avec couleur et label

import { 
  EMAIL_STATUS_LABELS, 
  EMAIL_STATUS_COLORS,
  type EmailEventStatus 
} from '@/types/resend.types'

interface EmailStatusBadgeProps {
  status: EmailEventStatus
}

/**
 * Badge coloré affichant le statut d'un email
 * Couleurs différentes selon le statut
 */
export function EmailStatusBadge({ status }: EmailStatusBadgeProps) {
  const label = EMAIL_STATUS_LABELS[status] || status
  const colorClass = EMAIL_STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 
      text-xs font-medium rounded-full
      ${colorClass}
    `}>
      {label}
    </span>
  )
}
