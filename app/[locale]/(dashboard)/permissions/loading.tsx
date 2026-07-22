import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-6 space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-8 w-40 bg-brand-primary/15" />
        <Skeleton className="h-10 w-32 bg-brand-primary/10" />
      </div>

      <div className="max-w-3xl space-y-4 rounded-xl border border-brand-primary/10 bg-brand-white p-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 border-b border-brand-primary/10 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-40 bg-brand-gris/20" />
              <Skeleton className="h-3 w-56 bg-brand-gris/10" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full bg-brand-primary/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
