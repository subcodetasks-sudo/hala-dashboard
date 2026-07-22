import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-6 space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-8 w-40 bg-brand-primary/15" />
        <Skeleton className="h-10 w-32 bg-brand-primary/10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-brand-primary/10 bg-brand-white p-4"
          >
            <Skeleton className="h-4 w-24 bg-brand-gris/20" />
            <Skeleton className="h-8 w-16 bg-brand-primary/20" />
            <Skeleton className="h-3 w-full bg-brand-gris/10" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-brand-primary/10 bg-brand-white p-4">
        <Skeleton className="mb-4 h-5 w-40 bg-brand-primary/15" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full bg-brand-gris/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
