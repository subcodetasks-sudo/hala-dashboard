import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-6 space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-8 w-44 bg-brand-primary/15" />
        <Skeleton className="h-10 w-36 bg-brand-primary/10" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-full max-w-md bg-brand-gris/15" />
        <Skeleton className="h-10 w-28 bg-brand-gris/10" />
      </div>

      <div className="overflow-hidden rounded-xl border border-brand-primary/10 bg-brand-white">
        <div className="grid grid-cols-4 gap-4 border-b border-brand-primary/10 bg-brand-background px-4 py-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full bg-brand-primary/15" />
          ))}
        </div>
        <div className="divide-y divide-brand-primary/10">
          {Array.from({ length: 7 }).map((_, row) => (
            <div key={row} className="grid grid-cols-4 items-center gap-4 px-4 py-4">
              <Skeleton className="h-4 w-full bg-brand-gris/15" />
              <Skeleton className="h-4 w-full font-mono bg-brand-gris/15" />
              <Skeleton className="h-6 w-24 rounded-full bg-brand-primary/15" />
              <Skeleton className="h-4 w-full bg-brand-gris/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
