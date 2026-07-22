import type { Metadata } from 'next'
import ProductsClient from './ProductsClient'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our full product catalog',
}

// Server Component — no 'use client' here
export default function ProductsPage() {
  return <ProductsClient />
}