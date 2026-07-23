import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Featured',
  description: 'Our hand-picked featured products',
}

export default async function FeaturedPage() {
  const supabase = await createClient()


  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('price', { ascending: false })
    .limit(6)

  if (error) {
    throw new Error(`Failed to fetch featured products: ${error.message}`)
  }

  if (!products || products.length === 0) {
    notFound() 
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Featured products</h1>
        <p className="text-slate-500 mt-1">
          Hand-picked selection — {products.length} items
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <FeaturedCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="text-brand-600 text-sm font-medium hover:text-brand-700"
        >
          View all products →
        </Link>
      </div>
    </div>
  )
}


function FeaturedCard({ product }: { product: any }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      {/* Price badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium bg-brand-50 text-brand-800 px-2 py-1 rounded-full capitalize">
          {product.category}
        </span>
        <span className="text-lg font-bold text-slate-900">
          ${product.price}
        </span>
      </div>

      <h3 className="font-semibold text-slate-900 mb-1">{product.name}</h3>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-green-600 font-medium">
          ● In stock
        </span>
        <AddToCartButton product={product} />
      </div>
    </div>
  )
}

import AddToCartButton from '@/components/shared/AddToCartButton' 