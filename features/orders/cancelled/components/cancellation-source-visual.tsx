"use client";

import CustomIcon from "@/components/custom-svg";
import { getCancellationSourceStyle } from "@/features/orders/cancelled/utils/cancellation-source-styles";
import { cn } from "@/lib/utils";

type CancellationSourceVisualProps = {
  source: string | null | undefined;
  label: string;
  className?: string;
};

/** Shared icon + label styling for source filter options and table badges. */
export default function CancellationSourceVisual({
  source,
  label,
  className,
}: CancellationSourceVisualProps) {
  const style = getCancellationSourceStyle(source);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-bold",
        style.iconClassName,
        className,
      )}
    >
      <CustomIcon
        src={style.iconSrc}
        size={16}
        className={cn("shrink-0", style.iconClassName)}
      />
      <span>{label}</span>
    </span>
  );
}
