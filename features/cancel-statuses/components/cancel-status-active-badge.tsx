"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CancelStatusActiveBadgeProps = {
  active: boolean;
};

export default function CancelStatusActiveBadge({
  active,
}: CancelStatusActiveBadgeProps) {
  const t = useTranslations("CancelStatuses.table");

  return (
    <Badge
      className={cn(
        "h-auto! inline-flex items-center gap-1.5 rounded-md border-transparent px-3 py-1.5 text-xs font-semibold",
        active
          ? "bg-brand-success-light text-brand-success"
          : "bg-brand-light-yellow text-brand-warning",
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          active ? "bg-brand-success" : "bg-brand-warning",
        )}
        aria-hidden
      />
      <span>{active ? t("statusActive") : t("statusInactive")}</span>
    </Badge>
  );
}
