import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="flex min-w-0 flex-col gap-6 p-4 pb-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full bg-brand-gris/15" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48 bg-brand-primary/15" />
          <Skeleton className="h-4 w-72 bg-brand-gris/15" />
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-s-full rounded-e-xl bg-brand-primary/20" />
        <Skeleton className="h-12 flex-1 rounded-e-full rounded-s-xl bg-brand-gris/15" />
      </div>
      <div className="flex flex-col gap-5 rounded-[1.75rem] border border-black/5 bg-brand-white p-5 sm:p-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full rounded-full bg-brand-gris/10" />
            <Skeleton className="h-11 w-full rounded-full bg-brand-gris/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
