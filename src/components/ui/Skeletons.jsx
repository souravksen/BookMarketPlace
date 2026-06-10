export function BookCardSkeleton() {
  return (
    <div className="card-glass overflow-hidden">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-3.5 space-y-2.5">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex justify-between items-center pt-2 border-t border-dark-800">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-8 w-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function BookDetailSkeleton() {
  return (
    <div className="section-max-width page-padding py-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-[3/4] max-h-[500px] skeleton rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-3/4 rounded" />
          <div className="skeleton h-5 w-1/2 rounded" />
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="skeleton h-8 w-24 rounded" />
          <div className="space-y-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-2/3 rounded" />
          </div>
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="card-glass p-5 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="skeleton h-5 w-32 rounded" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
    </div>
  );
}
