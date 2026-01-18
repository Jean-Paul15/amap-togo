// Checkbox moderne
// Design avec animation de coche

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

/**
 * Checkbox moderne avec animation
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className="group flex items-center gap-3 cursor-pointer select-none">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              'peer sr-only',
              className
            )}
            {...props}
          />
          <div
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-md border-2 border-gray-300',
              'transition-all duration-200',
              'peer-checked:border-green-500 peer-checked:bg-green-500',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-green-500/20',
              'group-hover:border-gray-400 peer-checked:group-hover:border-green-600',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed'
            )}
          >
            <Check className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'
