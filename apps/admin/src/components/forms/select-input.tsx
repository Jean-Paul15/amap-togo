// Select moderne
// Design coherent avec focus ring anime

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
}

/**
 * Select moderne avec icone
 */
export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'flex h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white',
            'pl-4 pr-10 py-2.5 text-sm shadow-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            'hover:border-gray-300',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    )
  }
)
SelectInput.displayName = 'SelectInput'
