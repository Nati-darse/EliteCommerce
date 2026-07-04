'use client'

import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useProducts, Product } from '@/hooks/useProducts'

// Mock data — Day 11 we replace this with real Supabase data
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 99, category: 'electronics', inStock: true },
  { id: '2', name: 'Running Shoes', price: 120, category: 'sports', inStock: true },
  { id: '3', name: 'Coffee Maker', price: 49, category: 'kitchen', inStock: false },
  { id: '4', name: 'Laptop Stand', price: 35, category: 'electronics', inStock: true },
  { id: '5', name: 'Yoga Mat', price: 25, category: 'sports', inStock: true },
  { id: '6', name: 'Blender', price: 79, category: 'kitchen', inStock: true },
]

export default function ProductsPage() {
  const {
    filteredProducts,
    filters,
    updateFilter,
    resetFilters,
    categories,
    filteredCount,
    totalCount,
  } = useProducts(MOCK_PRODUCTS)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <Input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="max-w-xs"
        />

        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => updateFilter('inStockOnly', e.target.checked)}
          />
          In stock only
        </label>

        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500 mb-4">
        Showing {filteredCount} of {totalCount} products
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-slate-500 text-sm">{product.category}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
            <span className={`text-xs mt-1 inline-block ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}