import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="flex min-w-0 flex-col gap-8 p-4 pb-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-52 bg-brand-primary/15" />
        <Skeleton className="h-4 w-full max-w-xl bg-brand-gris/15" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-5 rounded-[1.75rem] border border-black/5 bg-brand-white p-5"
          >
            <div className="flex items-start justify-between">
              <Skeleton className="size-11 rounded-2xl bg-brand-primary/10" />
              <Skeleton className="size-8 rounded-full bg-brand-gris/10" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-2/3 bg-brand-gris/20" />
              <Skeleton className="h-4 w-full bg-brand-gris/10" />
              <Skeleton className="h-4 w-4/5 bg-brand-gris/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
