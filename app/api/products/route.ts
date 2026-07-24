import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/products
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')
  const inStock = searchParams.get('in_stock')

  let query = supabase
    .from('products')
    .select('id, name, price, category, in_stock')
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (inStock === 'true') {
    query = query.eq('in_stock', true)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ products: data, count: data.length })
}

// POST /api/products
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { name, price, category, in_stock } = body as any

  // Validation — 422 for invalid data
  const errors: string[] = []
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('name is required and must be a non-empty string')
  }
  if (price === undefined || typeof price !== 'number' || price <= 0) {
    errors.push('price is required and must be a positive number')
  }
  if (!category || typeof category !== 'string') {
    errors.push('category is required and must be a string')
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: 'Validation failed', details: errors },
      { status: 422 }
    )
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: name.trim(),
      price,
      category: category.trim(),
      in_stock: in_stock ?? true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ product: data }, { status: 201 })
}