import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="flex min-w-0 flex-col gap-6 p-4 pb-8"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="h-5 w-72 bg-brand-gris/15" />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-56 bg-brand-primary/15" />
          <Skeleton className="h-4 w-full max-w-md bg-brand-gris/15" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Skeleton className="h-11 w-72 rounded-xl bg-brand-gris/15" />
          <Skeleton className="h-11 w-44 rounded-xl bg-brand-gris/20" />
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-black/5 bg-brand-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-11 rounded-xl bg-brand-gris/10" />
          ))}
        </div>
        <Skeleton className="h-6 w-40 bg-brand-primary/15" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl bg-brand-background" />
          ))}
        </div>
      </div>
    </div>
  );
}
