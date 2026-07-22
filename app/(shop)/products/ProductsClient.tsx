'use client'

import { useMemo, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/useProducts'
import { useStore } from '@/store'
import { useDebounce } from '@/hooks/useDebounce'


export default function ProductsPage() {
  const { data: products = [], isLoading, error } = useProducts()
  const addToCart = useStore((state) => state.addToCart)
  const toggleCart = useStore((state) => state.toggleCart)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [inStockOnly, setInStockOnly] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))]
    return ['all', ...cats]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCategory = category === 'all' || p.category === category
      const matchesStock = !inStockOnly || p.in_stock
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, debouncedSearch, category, inStockOnly])

  const handleAddToCart = useCallback((product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
    toggleCart()
  }, [addToCart, toggleCart])

  const resetFilters = useCallback(() => {
    setSearch('')
    setCategory('all')
    setInStockOnly(false)
  }, [])

  if (isLoading) return (
    <div className="max-w-6xl mx-auto p-6">
      <p className="text-slate-500">Loading products...</p>
    </div>
  )

  if (error) return (
    <div className="max-w-6xl mx-auto p-6">
      <p className="text-red-500">Error: {error.message}</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap items-center">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          In stock only
        </label>
        <Button variant="outline" onClick={resetFilters}>Reset</Button>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 flex flex-col gap-2">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-slate-500 text-sm capitalize">{product.category}</p>
            <p className="text-lg font-bold">${product.price}</p>
            <span className={`text-xs ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
            <Button
              onClick={() => handleAddToCart(product)}
              disabled={!product.in_stock}
              size="sm"
              className="mt-auto"
            >
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}