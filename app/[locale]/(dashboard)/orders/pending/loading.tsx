import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="flex min-w-0 flex-col gap-8 p-4 pb-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48 bg-brand-primary/15" />
        <Skeleton className="h-4 w-full max-w-md bg-brand-gris/15" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-36 rounded-[2.25rem] bg-brand-primary/10"
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-56 bg-brand-primary/15" />
        <div className="flex flex-wrap items-end gap-3">
          <Skeleton className="h-11 w-40 bg-brand-gris/10" />
          <Skeleton className="h-11 w-40 bg-brand-gris/10" />
          <Skeleton className="h-11 min-w-[220px] flex-1 bg-brand-gris/15" />
          <Skeleton className="h-11 w-44 bg-brand-gris/10" />
          <Skeleton className="h-11 w-36 bg-brand-accent/15" />
        </div>

        <div className="overflow-hidden rounded-2xl bg-brand-white">
          <div className="grid grid-cols-5 gap-4 border-b border-black/5 bg-brand-background/40 px-4 py-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full bg-brand-primary/15" />
            ))}
          </div>
          <div className="divide-y divide-black/5">
            {Array.from({ length: 6 }).map((_, row) => (
              <div key={row} className="grid grid-cols-5 gap-4 px-4 py-4">
                {Array.from({ length: 5 }).map((_, col) => (
                  <Skeleton key={col} className="h-4 w-full bg-brand-gris/15" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
