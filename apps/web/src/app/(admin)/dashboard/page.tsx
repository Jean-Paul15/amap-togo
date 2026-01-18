// Page d'accueil du back-office
// Tableau de bord moderne

'use client'

export const dynamic = 'force-dynamic'

import { useDashboardData } from '@/hooks/admin'
import {
  StatsCard,
  SalesChart,
  OrdersChart,
  TopProductsChart,
} from '@/components/admin/dashboard'
import {
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'
import { formatPrice } from '@amap-togo/utils'

/**
 * Dashboard admin moderne
 */
export default function AdminHomePage() {
  const { stats, ventesSemaine, commandesParStatut, topProduits, loading } =
    useDashboardData()

  const cartes = [
    {
      title: 'Produits actifs',
      value: stats.totalProduits,
      icon: Package,
      colorClass: 'bg-blue-500',
    },
    {
      title: 'Stock faible',
      value: stats.produitsStockFaible,
      icon: AlertTriangle,
      colorClass: stats.produitsStockFaible > 0 ? 'bg-amber-500' : 'bg-gray-300',
    },
    {
      title: 'En attente',
      value: stats.commandesEnAttente,
      icon: ShoppingCart,
      colorClass: stats.commandesEnAttente > 0 ? 'bg-green-500' : 'bg-gray-300',
    },
    {
      title: 'Clients',
      value: stats.totalClients,
      icon: Users,
      colorClass: 'bg-violet-500',
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
        {/* En-tete moderne */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Vue d&apos;ensemble de votre activité
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 shadow-sm">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-green-500 shadow-sm">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-green-600">
                Chiffre d&apos;affaires
              </p>
              <div className="flex items-center gap-1">
                <p className="text-lg sm:text-xl font-bold text-green-700">
                  {loading ? '...' : formatPrice(stats.chiffreAffaires)}
                </p>
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {cartes.map((carte) => (
            <StatsCard
              key={carte.title}
              title={carte.title}
              value={carte.value}
              icon={carte.icon}
              colorClass={carte.colorClass}
              loading={loading}
            />
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                Ventes des 7 derniers jours
              </h2>
              <span className="text-[10px] sm:text-xs font-medium text-gray-400 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                Cette semaine
              </span>
            </div>
            <SalesChart data={ventesSemaine} loading={loading} />
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                Répartition des commandes
              </h2>
              <span className="text-[10px] sm:text-xs font-medium text-gray-400 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                Par statut
              </span>
            </div>
            <OrdersChart data={commandesParStatut} loading={loading} />
          </div>
        </div>

        {/* Top produits */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Top 5 des produits vendus
            </h2>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              Classement
            </span>
          </div>
          <TopProductsChart data={topProduits} loading={loading} />
      </div>
    </div>
  )
}
