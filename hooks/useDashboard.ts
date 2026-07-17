import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const supabase = createClient()

// Sales summary stats
async function fetchDashboardStats() {
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, price, category, in_stock')

  if (pError) throw new Error(pError.message)

  const totalProducts = products.length
  const inStock = products.filter((p) => p.in_stock).length
  const outOfStock = totalProducts - inStock
  const avgPrice = products.reduce((s, p) => s + p.price, 0) / totalProducts

  // Group by category for chart
  const byCategory = products.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  const categoryData = Object.entries(byCategory).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
  }))

  // Price distribution for chart
  const priceRanges = [
    { range: '$0-50', min: 0, max: 50 },
    { range: '$51-100', min: 51, max: 100 },
    { range: '$101-200', min: 101, max: 200 },
    { range: '$200+', min: 201, max: Infinity },
  ]

  const priceData = priceRanges.map(({ range, min, max }) => ({
    range,
    count: products.filter((p) => p.price >= min && p.price <= max).length,
  }))

  return {
    totalProducts,
    inStock,
    outOfStock,
    avgPrice: Math.round(avgPrice),
    categoryData,
    priceData,
  }
}

export function useDashboardStats() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, 
  })

  // Realtime — invalidate dashboard when products change
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [queryClient])

  return query
}