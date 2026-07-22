import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-6 space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-8 w-52 bg-brand-primary/15" />
        <Skeleton className="h-10 w-36 bg-brand-primary/15" />
      </div>

      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-24 bg-brand-gris/15" />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-brand-primary/10 bg-brand-white p-4"
          >
            <Skeleton className="aspect-video w-full bg-brand-primary/10" />
            <Skeleton className="h-4 w-3/4 bg-brand-gris/20" />
            <Skeleton className="h-3 w-full bg-brand-gris/10" />
            <Skeleton className="h-3 w-2/3 bg-brand-gris/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
