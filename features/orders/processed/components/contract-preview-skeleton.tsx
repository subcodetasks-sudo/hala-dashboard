import { Skeleton } from "@/components/ui/skeleton";

export default function ContractPreviewSkeleton() {
  return (
    <div
      className="flex min-h-[22rem] flex-col rounded-[1.5rem] bg-brand-primary/10 px-6 py-8 sm:px-10"
      aria-hidden
    >
      <div className="mb-10 flex flex-col items-center gap-3">
        <Skeleton className="size-14 rounded-full bg-brand-gris/25" />
        <Skeleton className="h-2.5 w-24 rounded-full bg-brand-gris/20" />
      </div>

      <div className="flex flex-1 flex-col gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2.5">
            <Skeleton className="h-2.5 w-[72%] rounded-full bg-brand-gris/20" />
            <Skeleton className="h-2.5 w-[48%] rounded-full bg-brand-gris/15" />
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-end justify-between gap-4">
        <Skeleton className="h-8 w-24 rounded-xl bg-brand-gris/20" />
        <Skeleton className="h-8 w-24 rounded-xl bg-brand-gris/20" />
      </div>
    </div>
  );
}
