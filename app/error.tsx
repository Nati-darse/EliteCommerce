'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error('Root error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Go home
          </Button>
        </div>
        {error.digest && (
          <p className="text-xs text-slate-400 mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}