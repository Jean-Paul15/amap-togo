// Input texte moderne
// Design coherent avec focus ring anime

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Props additionnelles si necessaire
}

/**
 * Input texte moderne
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        dir="ltr"
        className={cn(
          'flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5',
          'text-sm shadow-sm transition-all duration-200',
          'placeholder:text-gray-400 text-left',
          'focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          'hover:border-gray-300',
          className
        )}
        {...props}
      />
    )
  }
)
TextInput.displayName = 'TextInput'
