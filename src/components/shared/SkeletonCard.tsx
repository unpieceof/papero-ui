export default function SkeletonCard({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 bg-bg-card border border-border rounded-card overflow-hidden">
        <div className="h-[260px] bg-[#2c2c2c] skeleton-pulse" />
        <div className="p-8 flex flex-col justify-center gap-4">
          <div className="h-6 bg-border rounded w-3/4 skeleton-pulse" />
          <div className="h-4 bg-border rounded w-1/2 skeleton-pulse" />
          <div className="h-4 bg-border rounded w-1/3 skeleton-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-card border border-border rounded-card overflow-hidden">
      <div className="h-[180px] bg-[#2c2c2c] skeleton-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-border rounded w-full skeleton-pulse" />
        <div className="h-4 bg-border rounded w-2/3 skeleton-pulse" />
        <div className="h-3 bg-border rounded w-1/2 skeleton-pulse" />
      </div>
      <div className="px-5 py-3 border-t border-border flex justify-between">
        <div className="h-3 bg-border rounded w-20 skeleton-pulse" />
        <div className="flex gap-2">
          <div className="w-[34px] h-[34px] rounded-full bg-border skeleton-pulse" />
          <div className="w-[34px] h-[34px] rounded-full bg-border skeleton-pulse" />
        </div>
      </div>
    </div>
  )
}
