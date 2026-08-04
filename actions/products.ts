'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const adminClient = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// State shape returned from every action
export type ActionState = {
  success: boolean
  error: string | null
  fieldErrors?: Record<string, string>
}

// CREATE product Server Action
export async function createProductAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {

  // Get authenticated user from cookie-based session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to add products' }
  }

  const name = formData.get('name') as string
  const priceRaw = formData.get('price') as string
  const category = formData.get('category') as string
  const inStock = formData.get('in_stock') === 'on'

  const fieldErrors: Record<string, string> = {}

  if (!name || name.trim() === '') {
    fieldErrors.name = 'Product name is required'
  }

  const price = parseFloat(priceRaw)
  if (isNaN(price) || price <= 0) {
    fieldErrors.price = 'Price must be a positive number'
  }

  if (!category || category.trim() === '') {
    fieldErrors.category = 'Category is required'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please fix the errors below', fieldErrors }
  }
  const { error } = await adminClient
    .from('products')
    .insert({
      name: name.trim(),
      price,
      category: category.trim(),
      in_stock: inStock,
    })

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  // Revalidate the products page cache so new product appears immediately
  revalidatePath('/products')
  revalidatePath('/featured')
  revalidatePath('/dashboard')

  // Redirect to products list after successful creation
  redirect('/products')
}

// UPDATE product stock Server Action
export async function toggleStockAction(
  productId: string,
  currentStock: boolean
): Promise<ActionState> {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await adminClient
    .from('products')
    .update({ in_stock: !currentStock })
    .eq('id', productId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/products')
  revalidatePath('/featured')

  return { success: true, error: null }
}

// DELETE product Server Action
export async function deleteProductAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const productId = formData.get('productId') as string

  if (!productId) {
    return { success: false, error: 'Product ID is required' }
  }

  const { error } = await adminClient
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/products')
  revalidatePath('/featured')
  revalidatePath('/dashboard')

  return { success: true, error: null }
}