"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { ContentStatus } from "@/features/content-management/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  ContentStatus,
  { badge: string; dot: string }
> = {
  published: {
    badge: "bg-brand-success-light text-brand-success",
    dot: "bg-brand-success",
  },
  draft: {
    badge: "bg-brand-light-yellow text-brand-warning",
    dot: "bg-brand-warning",
  },
};

type ContentStatusBadgeProps = {
  status: ContentStatus;
};

export default function ContentStatusBadge({ status }: ContentStatusBadgeProps) {
  const t = useTranslations("ContentManagement.table");
  const styles = STATUS_STYLES[status];

  return (
    <Badge
      className={cn(
        "h-auto! inline-flex items-center gap-1.5 rounded-md border-transparent px-3 py-1.5 text-xs font-semibold",
        styles.badge
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", styles.dot)}
        aria-hidden
      />
      <span>
        {status === "published" ? t("statusPublished") : t("statusDraft")}
      </span>
    </Badge>
  );
}
