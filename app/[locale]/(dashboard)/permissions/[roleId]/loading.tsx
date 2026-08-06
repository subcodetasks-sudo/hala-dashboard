import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="flex min-w-0 flex-col p-4 pb-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex w-full flex-col gap-6 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-56 bg-brand-primary/15" />
          <Skeleton className="size-9 rounded-full bg-brand-gris/15" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-28 rounded-3xl bg-brand-primary/15" />
          <Skeleton className="h-8 w-48 bg-brand-primary/15" />
          <Skeleton className="h-5 w-72 max-w-full bg-brand-gris/15" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-40 bg-brand-primary/15" />
          <Skeleton className="h-7 w-24 rounded-xl bg-brand-primary/15" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl bg-brand-background" />
        <Skeleton className="h-48 w-full rounded-[1.75rem] bg-brand-background" />
      </div>
    </div>
  );
}
