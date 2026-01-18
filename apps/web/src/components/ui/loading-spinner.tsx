// Indicateur de chargement
// Spinner simple et elegant

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
}

/**
 * Spinner de chargement anime
 */
export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`
        ${sizes[size]}
        border-primary/30 border-t-primary
        rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="Chargement"
    />
  )
}
