import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/products/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ product: data })
}

// PATCH /api/products/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('products')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Product not found or update failed' },
      { status: 404 }
    )
  }

  return NextResponse.json({ product: data })
}

// DELETE /api/products/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}