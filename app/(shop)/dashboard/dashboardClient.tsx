'use client'

import { lazy, Suspense, useCallback } from 'react'
import { useDashboardStats } from '@/hooks/useDashboard'
import StatCard from '@/components/dashboard/StatCard'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'


const CategoryChart = lazy(() => import('@/components/dashboard/CategoryChart'))
const PriceChart = lazy(() => import('@/components/dashboard/PriceChart'))

function ChartSkeleton() {
  return (
    <div className="h-[314px] bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
      <p className="text-slate-400 text-sm">Loading chart...</p>
    </div>
  )
}

export default function DashboardPage() {
  const { data: stats, isLoading, error, dataUpdatedAt } = useDashboardStats()
  const queryClient = useQueryClient()

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
  }, [queryClient])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-red-500">Failed to load dashboard</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      {/* Stat Cards — React.memo inside */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          subtitle="across all categories"
        />
        <StatCard
          title="In Stock"
          value={stats.inStock}
          color="text-green-600"
          subtitle="available now"
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          color="text-red-500"
          subtitle="needs restocking"
        />
        <StatCard
          title="Average Price"
          value={`$${stats.avgPrice}`}
          subtitle="across all products"
        />
      </div>

      {/* Charts — React.lazy + Suspense */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <CategoryChart data={stats.categoryData} />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <PriceChart data={stats.priceData} />
        </Suspense>
      </div>

      {/* Realtime indicator */}
      <div className="mt-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <p className="text-xs text-slate-400">
          Live — updates automatically when products change
        </p>
      </div>
    </div>
  )
}
