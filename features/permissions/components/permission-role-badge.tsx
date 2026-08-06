"use client";

import { Badge } from "@/components/ui/badge";
import type { PermissionRoleKey } from "@/features/permissions/types";
import { getRoleBadgeStyle } from "@/features/permissions/role-ui-config";
import { cn } from "@/lib/utils";

type PermissionRoleBadgeProps = {
  label: string;
  roleKey: PermissionRoleKey | null;
};

export default function PermissionRoleBadge({
  label,
  roleKey,
}: PermissionRoleBadgeProps) {
  return (
    <Badge
      className={cn(
        "h-auto! rounded-xl border-transparent px-3.5 py-2 text-xs font-bold whitespace-nowrap",
        getRoleBadgeStyle(roleKey),
      )}
    >
      {label}
    </Badge>
  );
}
