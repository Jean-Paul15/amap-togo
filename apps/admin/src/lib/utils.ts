// Utilitaires CSS pour le back-office
// Fonction cn pour combiner les classes Tailwind

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine les classes Tailwind de maniere intelligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
