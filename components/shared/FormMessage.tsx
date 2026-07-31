interface FormMessageProps {
  error?: string | null
  success?: boolean
  successMessage?: string
}

export default function FormMessage({
  error,
  success,
  successMessage = 'Done!',
}: FormMessageProps) {
  if (!error && !success) return null

  if (error) {
    return (
      <div
        data-testid="form-error"
        className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg"
      >
        {error}
      </div>
    )
  }

  return (
    <div
      data-testid="form-success"
      className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg"
    >
      {successMessage}
    </div>
  )
}