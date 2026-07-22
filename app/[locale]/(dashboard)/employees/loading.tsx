import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-6 space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-8 w-36 bg-brand-primary/15" />
        <Skeleton className="h-10 w-36 bg-brand-primary/15" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-full max-w-sm bg-brand-gris/15" />
        <Skeleton className="h-10 w-28 bg-brand-gris/10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-xl border border-brand-primary/10 bg-brand-white p-4"
          >
            <Skeleton className="size-12 shrink-0 rounded-full bg-brand-primary/20" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-32 bg-brand-gris/20" />
              <Skeleton className="h-3 w-24 bg-brand-gris/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
