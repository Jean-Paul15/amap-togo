// Composant Skeleton pour les etats de chargement

interface SkeletonProps {
  className?: string
}

/**
 * Skeleton anime pour le loading
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  )
}
