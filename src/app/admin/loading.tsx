export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-secondary/30 lg:pl-64">
      {/* Mobile top bar skeleton */}
      <div className="lg:hidden sticky top-0 z-30 bg-forest p-3 h-14 animate-pulse" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Page title skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-secondary/60 rounded animate-pulse" />
          <div className="h-4 w-72 bg-secondary/40 rounded animate-pulse" />
        </div>

        {/* Stat tiles skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-forest/15 bg-card p-5 shadow-warm">
              <div className="h-10 w-10 rounded-xl bg-secondary/60 animate-pulse mb-3" />
              <div className="h-7 w-16 bg-secondary/60 rounded animate-pulse mb-2" />
              <div className="h-3 w-24 bg-secondary/40 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
          <div className="h-5 w-48 bg-secondary/60 rounded animate-pulse mb-4" />
          <div className="h-48 bg-secondary/30 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
