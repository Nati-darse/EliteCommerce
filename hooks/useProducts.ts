import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  in_stock: boolean
  description?: string
  image_url?: string
}

const supabase = createClient()

// Fetch all products
async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// Main hook — products with realtime
export function useProducts() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Realtime update:', payload)
          queryClient.invalidateQueries({ queryKey: ['products'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return query
}