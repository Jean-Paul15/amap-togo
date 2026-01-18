// Graphique des ventes moderne
// Design avec gradient et animations

'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

interface VenteJour {
  jour: string
  total: number
  commandes: number
}

interface SalesChartProps {
  data: VenteJour[]
  loading?: boolean
}

/**
 * Graphique des ventes moderne
 */
export function SalesChart({ data, loading }: SalesChartProps) {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="space-y-3 w-full px-4">
          <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-3 bg-gray-100 rounded-full animate-pulse w-3/4" />
          <div className="h-32 bg-gradient-to-t from-gray-50 to-transparent rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  const formatValue = (v: number) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
    if (v >= 1000) return `${(v / 1000).toFixed(0)}k`
    return v.toString()
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGradientModern" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25} />
            <stop offset="50%" stopColor="#22c55e" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="jour"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          tickFormatter={formatValue}
          width={45}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            padding: '14px 18px',
          }}
          formatter={(value) => [
            `${(value ?? 0).toLocaleString('fr-FR')} FCFA`,
            'Ventes',
          ]}
          labelStyle={{ color: '#6b7280', fontWeight: 600, marginBottom: 6 }}
          cursor={{ stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#22c55e"
          strokeWidth={2.5}
          fill="url(#salesGradientModern)"
          dot={false}
          activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
