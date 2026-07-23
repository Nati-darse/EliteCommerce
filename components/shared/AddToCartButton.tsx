'use client'  

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'

interface Product {
  id: string
  name: string
  price: number
  category: string
  in_stock: boolean
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const addToCart = useStore((state) => state.addToCart)

  function handleAdd() {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Button
      size="sm"
      onClick={handleAdd}
      className="bg-brand-600 hover:bg-brand-700 text-white border-0"
    >
      {added ? '✓ Added' : 'Add to cart'}
    </Button>
  )
}