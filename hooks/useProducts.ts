import { useState, useMemo, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useDebounce } from './useDebounce'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  inStock: boolean
}

export interface ProductFilters {
  search: string
  category: string
  minPrice: number
  maxPrice: number
  inStockOnly: boolean
}

const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 10000,
  inStockOnly: false,
}

export function useProducts(products: Product[]) {
  const [filters, setFilters] = useLocalStorage<ProductFilters>(
    'elite-product-filters',
    DEFAULT_FILTERS
  )

  const debouncedSearch = useDebounce(filters.search, 300)

  // useMemo — only recalculates when products or filters actually change
  // without this, filtering runs on EVERY render — kills performance at scale
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())

      const matchesCategory =
        filters.category === 'all' || product.category === filters.category

      const matchesPrice =
        product.price >= filters.minPrice && product.price <= filters.maxPrice

      const matchesStock = !filters.inStockOnly || product.inStock

      return matchesSearch && matchesCategory && matchesPrice && matchesStock
    })
  }, [products, debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.inStockOnly])

  // useCallback — stable reference so child components don't re-render
  // when parent re-renders for unrelated reasons
  const updateFilter = useCallback(<K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [setFilters])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [setFilters])

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))]
    return ['all', ...cats]
  }, [products])

  return {
    filteredProducts,
    filters,
    updateFilter,
    resetFilters,
    categories,
    totalCount: products.length,
    filteredCount: filteredProducts.length,
  }
}