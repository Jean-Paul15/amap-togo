// Liste top produits moderne
// Design avec barres de progression animees

'use client'

interface ProduitVendu {
  nom: string
  quantite: number
}

interface TopProductsChartProps {
  data: ProduitVendu[]
  loading?: boolean
}

const COLORS = [
  'from-green-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
]

/**
 * Liste top produits avec barres modernes
 */
export function TopProductsChart({ data, loading }: TopProductsChartProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
              <div className="h-2 bg-gray-50 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-gray-400">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-sm font-medium">Aucune vente enregistrée</p>
        <p className="text-xs text-gray-300 mt-1">Les produits vendus apparaîtront ici</p>
      </div>
    )
  }

  const maxQty = Math.max(...data.map((p) => p.quantite))

  return (
    <div className="space-y-4">
      {data.map((produit, index) => {
        const pct = (produit.quantite / maxQty) * 100
        const colorClass = COLORS[index % COLORS.length]
        
        return (
          <div key={produit.nom} className="group">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${colorClass} text-white text-sm font-bold shadow-sm`}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors">
                  {produit.nom}
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-900 tabular-nums">
                {produit.quantite}
                <span className="text-gray-400 font-normal ml-1">vendus</span>
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-11">
              <div
                className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
