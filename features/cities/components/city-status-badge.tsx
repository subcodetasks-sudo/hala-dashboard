"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { CityStatus } from "@/features/cities/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<CityStatus, { badge: string; dot: string }> = {
  active: {
    badge: "bg-brand-success-light text-brand-success",
    dot: "bg-brand-success",
  },
  inactive: {
    badge: "bg-brand-light-yellow text-brand-warning",
    dot: "bg-brand-warning",
  },
};

type CityStatusBadgeProps = {
  status: CityStatus;
};

export default function CityStatusBadge({ status }: CityStatusBadgeProps) {
  const t = useTranslations("Cities.table");
  const styles = STATUS_STYLES[status];

  return (
    <Badge
      className={cn(
        "h-auto! inline-flex items-center gap-1.5 rounded-md border-transparent px-3 py-1.5 text-xs font-semibold",
        styles.badge,
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", styles.dot)}
        aria-hidden
      />
      <span>
        {status === "active" ? t("statusActive") : t("statusInactive")}
      </span>
    </Badge>
  );
}
