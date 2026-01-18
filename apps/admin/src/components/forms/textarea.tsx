// Textarea moderne
// Design coherent avec focus ring anime

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Props additionnelles si necessaire
}

/**
 * Textarea moderne
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[100px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3',
          'text-sm shadow-sm transition-all duration-200 resize-none',
          'placeholder:text-gray-400',
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
Textarea.displayName = 'Textarea'
