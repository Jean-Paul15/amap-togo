// Carte de statistique moderne
// Design avec animations subtiles

'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  colorClass: string
  loading?: boolean
  subtitle?: string
  trend?: { value: number; positive: boolean }
}

/**
 * Carte KPI moderne avec animation
 */
export function StatsCard({
  title,
  value,
  icon: Icon,
  colorClass,
  loading = false,
  subtitle,
  trend,
}: StatsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 hover:-translate-y-0.5">
      {/* Gradient de fond subtil */}
      <div
        className={cn(
          'absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity',
          colorClass.replace('bg-', 'bg-gradient-to-br from-')
        )}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl',
              'shadow-sm transition-transform group-hover:scale-105',
              colorClass
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
                trend.positive
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              )}
            >
              {trend.positive ? '+' : ''}
              {trend.value}%
            </span>
          )}
        </div>

        <div className="space-y-1">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-100" />
          ) : (
            <p className="text-2xl font-bold tracking-tight text-gray-900">
              {value}
            </p>
          )}
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
