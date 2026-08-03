import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ContentMetaBadgeProps = {
  label: string;
  className?: string;
  dotClassName?: string;
};

/**
 * Soft pill badge used for type / appearance / author cells.
 * Pass `dotClassName` to show a status-style colored dot (matches design).
 */
export default function ContentMetaBadge({
  label,
  className,
  dotClassName,
}: ContentMetaBadgeProps) {
  return (
    <Badge
      className={cn(
        "h-auto! inline-flex items-center gap-1.5 rounded-md border-transparent px-3 py-1.5 text-xs font-semibold",
        className
      )}
    >
      {dotClassName ? (
        <span
          className={cn("size-1.5 shrink-0 rounded-full", dotClassName)}
          aria-hidden
        />
      ) : null}
      <span>{label}</span>
    </Badge>
  );
}
