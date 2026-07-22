import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-bold text-indigo-100">404</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-4 mb-2">
          Page not found
        </h2>
        <p className="text-slate-500 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}