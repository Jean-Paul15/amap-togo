// Page d'accueil du back-office
// Tableau de bord moderne

'use client'

export const dynamic = 'force-dynamic'

import { AdminLayout } from '@/components/layout'
import { useDashboardData } from '@/hooks'
import {
  StatsCard,
  SalesChart,
  OrdersChart,
  TopProductsChart,
} from '@/components/dashboard'
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
    <AdminLayout>
      <div className="space-y-8">
        {/* En-tete moderne */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Vue d&apos;ensemble de votre activite
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl px-5 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 shadow-sm">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-green-600">
                Chiffre d&apos;affaires
              </p>
              <div className="flex items-center gap-1">
                <p className="text-xl font-bold text-green-700">
                  {loading ? '...' : formatPrice(stats.chiffreAffaires)}
                </p>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-gray-900">
                Ventes des 7 derniers jours
              </h2>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                Cette semaine
              </span>
            </div>
            <SalesChart data={ventesSemaine} loading={loading} />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-gray-900">
                Repartition des commandes
              </h2>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                Par statut
              </span>
            </div>
            <OrdersChart data={commandesParStatut} loading={loading} />
          </div>
        </div>

        {/* Top produits */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-gray-900">
              Top 5 des produits vendus
            </h2>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
              Classement
            </span>
          </div>
          <TopProductsChart data={topProduits} loading={loading} />
        </div>
      </div>
    </AdminLayout>
  )
}
