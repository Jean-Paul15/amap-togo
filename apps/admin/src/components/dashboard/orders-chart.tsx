// Graphique commandes moderne
// Design donut avec legende interactive

'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { CommandeStatut } from '@/types'

interface OrdersChartProps {
  data: CommandeStatut[]
  loading?: boolean
}

const STATUT_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmee',
  en_preparation: 'Preparation',
  prete: 'Prete',
  livree: 'Livree',
  annulee: 'Annulee',
}

/**
 * Graphique donut moderne
 */
export function OrdersChart({ data, loading }: OrdersChartProps) {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center gap-6">
        <div className="w-36 h-36 rounded-full border-8 border-gray-100 animate-pulse" />
        <div className="space-y-3 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const total = data.reduce((acc, item) => acc + item.count, 0)

  const renderLegend = () => (
    <div className="space-y-2.5 mt-2">
      {data.map((item) => (
        <div
          key={item.statut}
          className="flex items-center gap-2.5 group cursor-default"
        >
          <div
            className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm transition-transform group-hover:scale-110"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-600 flex-1 group-hover:text-gray-900 transition-colors">
            {STATUT_LABELS[item.statut] || item.statut}
          </span>
          <span className="text-sm font-semibold text-gray-900 tabular-nums">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex items-center gap-8">
      <div className="relative w-44 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="count"
              strokeWidth={0}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, STATUT_LABELS[String(name)] || name]}
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                padding: '10px 14px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Centre avec total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-gray-900">{total}</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Total
          </span>
        </div>
      </div>
      <div className="flex-1">{renderLegend()}</div>
    </div>
  )
}
