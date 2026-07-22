import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-6 space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-8 w-56 bg-brand-primary/15" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 bg-brand-success/20" />
          <Skeleton className="h-10 w-28 bg-brand-primary/10" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="space-y-2 rounded-xl border border-brand-primary/10 bg-brand-white p-4"
          >
            <Skeleton className="h-4 w-24 bg-brand-gris/20" />
            <Skeleton className="h-7 w-20 bg-brand-primary/20" />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-brand-primary/10 bg-brand-white">
        <div className="grid grid-cols-4 gap-4 border-b border-brand-primary/10 bg-brand-background px-4 py-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full bg-brand-primary/15" />
          ))}
        </div>
        <div className="divide-y divide-brand-primary/10">
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="grid grid-cols-4 gap-4 px-4 py-4">
              {Array.from({ length: 4 }).map((_, col) => (
                <Skeleton key={col} className="h-4 w-full bg-brand-gris/15" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
