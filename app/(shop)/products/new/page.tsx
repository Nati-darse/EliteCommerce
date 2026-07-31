import type { Metadata } from 'next'
import AddProductForm from './AddProductForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Add Product',
}

// Server Component — check auth before rendering form
export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Server-side auth guard — redirect if not logged in
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Add product</h1>
        <p className="text-slate-500 mt-1">
          Fill in the details to add a new product to the catalog.
        </p>
      </div>
      <AddProductForm />
    </div>
  )
}