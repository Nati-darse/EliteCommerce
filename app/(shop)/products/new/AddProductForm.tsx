'use client'

import { useActionState } from 'react'
import { createProductAction, ActionState } from '@/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormMessage from '@/components/shared/FormMessage'
import Link from 'next/link'

const initialState: ActionState = {
  success: false,
  error: null,
  fieldErrors: {},
}

const CATEGORIES = ['electronics', 'sports', 'kitchen', 'clothing', 'books', 'other']

export default function AddProductForm() {
  const [state, action, isPending] = useActionState(
    createProductAction,
    initialState
  )

  return (
    <form action={action} className="space-y-6">

      {/* Global error/success message */}
      <FormMessage error={state.error} success={state.success} />

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Wireless Headphones"
          disabled={isPending}
          className={state.fieldErrors?.name ? 'border-red-400' : ''}
        />
        {state.fieldErrors?.name && (
          <p className="text-xs text-red-500">{state.fieldErrors.name}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="29.99"
          disabled={isPending}
          className={state.fieldErrors?.price ? 'border-red-400' : ''}
        />
        {state.fieldErrors?.price && (
          <p className="text-xs text-red-500">{state.fieldErrors.price}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          disabled={isPending}
          className={`w-full border rounded-md px-3 py-2 text-sm bg-white
            ${state.fieldErrors?.category ? 'border-red-400' : 'border-slate-200'}`}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        {state.fieldErrors?.category && (
          <p className="text-xs text-red-500">{state.fieldErrors.category}</p>
        )}
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-3">
        <input
          id="in_stock"
          name="in_stock"
          type="checkbox"
          defaultChecked
          disabled={isPending}
          className="w-4 h-4 accent-brand-600"
        />
        <Label htmlFor="in_stock">In stock</Label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-brand-600 hover:bg-brand-700 text-white border-0"
        >
          {isPending ? 'Adding product...' : 'Add product'}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Cancel</Link>
        </Button>
      </div>

    </form>
  )
}