export default function ShopLoading() {
  return (
    <div className="max-w-6xl mx-auto">

      {/* Page title skeleton */}
      <div className="h-9 w-48 bg-slate-200 rounded-lg animate-pulse mb-6" />

      {/* Filters skeleton */}
      <div className="flex gap-4 mb-6">
        <div className="h-9 w-64 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-9 w-36 bg-slate-200 rounded-lg animate-pulse" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white">
            <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse mb-3" />
            <div className="h-8 w-full bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}