import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-w-0 flex-col gap-8 p-4 pb-8" aria-busy="true" aria-live="polite">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-56 bg-brand-primary/15" />
          <Skeleton className="h-4 w-80 max-w-full bg-brand-gris/15" />
        </div>
        <Skeleton className="h-11 w-44 rounded-xl bg-brand-gris/20" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-36 rounded-[2.25rem] bg-brand-primary/10"
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-52 bg-brand-primary/15" />
        <div className="flex flex-wrap items-end gap-3">
          <Skeleton className="h-11 w-40 rounded-xl bg-brand-gris/15" />
          <Skeleton className="h-11 w-40 rounded-xl bg-brand-gris/15" />
          <Skeleton className="h-11 min-w-[220px] flex-1 rounded-full bg-brand-gris/15" />
          <Skeleton className="h-11 w-36 rounded-full bg-brand-gris/10" />
          <Skeleton className="h-11 w-36 rounded-full bg-brand-gris/10" />
          <Skeleton className="h-11 w-32 rounded-full bg-brand-accent/20" />
        </div>

        <div className="overflow-hidden rounded-xl border border-brand-primary/10 bg-brand-white">
          <div className="grid grid-cols-5 gap-4 border-b border-brand-primary/10 bg-brand-background px-4 py-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full bg-brand-primary/15" />
            ))}
          </div>
          <div className="divide-y divide-brand-primary/10">
            {Array.from({ length: 6 }).map((_, row) => (
              <div
                key={row}
                className="grid grid-cols-5 items-center gap-4 px-4 py-4"
              >
                {Array.from({ length: 4 }).map((_, col) => (
                  <Skeleton key={col} className="h-4 w-full bg-brand-gris/15" />
                ))}
                <Skeleton className="h-6 w-20 rounded-full bg-brand-success/25" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
