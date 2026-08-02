"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import CancellationSourceVisual from "@/features/orders/cancelled/components/cancellation-source-visual";
import {
  getCancellationSourceStyle,
  resolveCancellationSourceValue,
} from "@/features/orders/cancelled/utils/cancellation-source-styles";
import { cn } from "@/lib/utils";

type CancelledSourceBadgeProps = {
  source: string | null | undefined;
  label?: string | null;
};

export default function CancelledSourceBadge({
  source,
  label,
}: CancelledSourceBadgeProps) {
  const t = useTranslations("Orders.Cancelled");
  const resolved = resolveCancellationSourceValue(source);
  const style = getCancellationSourceStyle(source);

  const displayLabel =
    label?.trim() ||
    (resolved ? t(`table.${style.labelKey}`) : "—");

  if (!source && !label?.trim()) {
    return (
      <Badge className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border-transparent bg-[#F5F5F5] px-3 py-4 text-brand-gris">
        —
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border-transparent px-3 py-4",
        style.surfaceClassName,
      )}
    >
      <CancellationSourceVisual source={source} label={displayLabel} />
    </Badge>
  );
}
