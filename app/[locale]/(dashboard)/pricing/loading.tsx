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

      <div className="flex flex-col gap-5 rounded-[1.75rem] border border-black/5 bg-brand-white p-5 sm:p-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full rounded-full bg-brand-gris/10" />
            <Skeleton className="h-11 w-full rounded-full bg-brand-gris/10" />
          </div>
        ))}
        <div className="flex justify-end">
          <Skeleton className="h-11 w-36 rounded-full bg-brand-primary/20" />
        </div>
      </div>
    </div>
  );
}
