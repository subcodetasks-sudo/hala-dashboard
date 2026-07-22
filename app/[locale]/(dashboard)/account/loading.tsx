import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-6 space-y-6" aria-busy="true" aria-live="polite">
      <Skeleton className="h-8 w-48 bg-brand-primary/15" />

      <div className="flex items-center gap-4">
        <Skeleton className="size-20 shrink-0 rounded-full bg-brand-primary/20" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 bg-brand-gris/20" />
          <Skeleton className="h-4 w-28 bg-brand-gris/10" />
        </div>
      </div>

      <div className="max-w-2xl space-y-5 rounded-xl border border-brand-primary/10 bg-brand-white p-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-28 bg-brand-gris/20" />
            <Skeleton className="h-10 w-full bg-brand-primary/10" />
          </div>
        ))}
        <Skeleton className="mt-2 h-10 w-32 bg-brand-primary/20" />
      </div>
    </div>
  );
}
