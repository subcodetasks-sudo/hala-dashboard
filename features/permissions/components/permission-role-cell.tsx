"use client";

import CustomIcon from "@/components/custom-svg";
import type { PermissionRoleKey } from "@/features/permissions/types";
import { getRoleIconConfig } from "@/features/permissions/role-ui-config";
import { cn } from "@/lib/utils";

type PermissionRoleCellProps = {
  label: string;
  name: string;
  roleKey: PermissionRoleKey | null;
  subtitle: string;
};

export default function PermissionRoleCell({
  label,
  name,
  roleKey,
  subtitle,
}: PermissionRoleCellProps) {
  const config = getRoleIconConfig(roleKey);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          config.iconBgClassName,
        )}
      >
        <CustomIcon
          src={config.iconSrc}
          size={20}
          className={config.iconClassName}
        />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-semibold text-brand-black">{label || name}</span>
        <span className="text-xs leading-snug text-brand-gris">{subtitle}</span>
      </div>
    </div>
  );
}
