"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { PermissionRoleStatus } from "@/features/permissions/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  PermissionRoleStatus,
  { badge: string; dot: string }
> = {
  active: {
    badge: "bg-brand-success-light text-brand-success",
    dot: "bg-brand-success",
  },
  inactive: {
    badge: "bg-brand-error/10 text-brand-error",
    dot: "bg-brand-error",
  },
};

type PermissionRoleStatusBadgeProps = {
  status: PermissionRoleStatus;
};

export default function PermissionRoleStatusBadge({
  status,
}: PermissionRoleStatusBadgeProps) {
  const t = useTranslations("Permissions.table");
  const styles = STATUS_STYLES[status];

  return (
    <Badge
      className={cn(
        "h-auto! inline-flex items-center gap-1.5 rounded-xl border-transparent px-3 py-1.5 text-xs font-semibold",
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
