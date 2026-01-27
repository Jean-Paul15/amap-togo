// Types pour l'intégration Resend
// Typage strict des emails envoyés et réponses API

/** Statut possible d'un email envoyé */
export type EmailEventStatus = 
  | 'sent' 
  | 'delivered' 
  | 'delivery_delayed'
  | 'opened' 
  | 'clicked'
  | 'bounced' 
  | 'complained'
  | 'canceled'
  | 'failed'
  | 'queued'
  | 'scheduled'

/** Email dans la liste des emails envoyés (Resend API) */
export interface ResendEmail {
  id: string
  to: string[]
  from: string
  created_at: string
  subject: string
  bcc: string[] | null
  cc: string[] | null
  reply_to: string[] | null
  last_event: EmailEventStatus
  scheduled_at: string | null
}

/** Réponse de la liste des emails (Resend API) */
export interface ResendEmailListResponse {
  object: 'list'
  has_more: boolean
  data: ResendEmail[]
}

/** Réponse d'envoi d'email (Resend API) */
export interface ResendSendResponse {
  id: string
}

/** Résultat d'envoi d'un email individuel */
export interface EmailSendResult {
  email: string
  success: boolean
  id?: string
  error?: string
}

/** Résultat global de la campagne d'envoi */
export interface CampaignSendResult {
  success: boolean
  total: number
  sent: number
  failed: number
  message: string
  details: EmailSendResult[]
}

/** Payload pour l'API d'envoi d'emails */
export interface SendEmailsPayload {
  recipients: string[]
  subject: string
  htmlContent: string
}

/** Labels français pour les statuts */
export const EMAIL_STATUS_LABELS: Record<EmailEventStatus, string> = {
  sent: 'Envoyé',
  delivered: 'Délivré',
  delivery_delayed: 'Retardé',
  opened: 'Ouvert',
  clicked: 'Cliqué',
  bounced: 'Rebondi',
  complained: 'Signalé spam',
  canceled: 'Annulé',
  failed: 'Échec',
  queued: 'En file',
  scheduled: 'Programmé'
}

/** Couleurs pour les statuts (Tailwind classes) */
export const EMAIL_STATUS_COLORS: Record<EmailEventStatus, string> = {
  sent: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  delivery_delayed: 'bg-yellow-100 text-yellow-700',
  opened: 'bg-emerald-100 text-emerald-700',
  clicked: 'bg-teal-100 text-teal-700',
  bounced: 'bg-red-100 text-red-700',
  complained: 'bg-orange-100 text-orange-700',
  canceled: 'bg-gray-100 text-gray-700',
  failed: 'bg-red-100 text-red-700',
  queued: 'bg-purple-100 text-purple-700',
  scheduled: 'bg-indigo-100 text-indigo-700'
}
