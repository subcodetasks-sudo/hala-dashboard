import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="flex min-w-0 flex-col gap-6 p-4 pb-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="space-y-3">
        <Skeleton className="h-4 w-64 bg-brand-gris/15" />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-48 bg-brand-primary/15" />
          <Skeleton className="h-10 w-36 bg-brand-gris/10" />
        </div>
      </div>

      <Skeleton className="h-20 w-full rounded-2xl bg-brand-background" />

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4 rounded-2xl border border-brand-primary/10 bg-brand-white p-5">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-36 rounded-lg bg-brand-primary/15" />
            <Skeleton className="h-10 w-32 rounded-lg bg-brand-gris/10" />
            <Skeleton className="h-10 w-28 rounded-lg bg-brand-gris/10" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-11 w-full rounded-xl bg-brand-gris/10"
              />
            ))}
            <Skeleton className="h-11 w-full rounded-xl bg-brand-gris/10 md:col-span-2" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-80">
          <Skeleton className="h-48 w-full rounded-2xl bg-brand-primary/10" />
          <Skeleton className="h-40 w-full rounded-2xl bg-brand-gris/10" />
          <Skeleton className="h-28 w-full rounded-2xl bg-brand-primary/10" />
        </div>
      </div>
    </div>
  );
}
