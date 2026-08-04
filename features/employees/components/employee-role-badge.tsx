"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { EmployeeJobRole } from "@/features/employees/types";
import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<EmployeeJobRole, string> = {
  review:
    "bg-brand-primary/15 text-brand-dark-blue",
  dataProcessing:
    "bg-brand-purple/15 text-brand-purple",
  contractFollowUp:
    "bg-brand-accent/10 text-brand-accent",
};

type EmployeeRoleBadgeProps = {
  role: EmployeeJobRole;
};

export default function EmployeeRoleBadge({ role }: EmployeeRoleBadgeProps) {
  const t = useTranslations("Employees.filters.roles");

  return (
    <Badge
      className={cn(
        "h-auto! inline-flex items-center rounded-xl border-transparent px-3.5 py-2.5 text-xs font-bold whitespace-nowrap",
        ROLE_STYLES[role],
      )}
    >
      {t(role)}
    </Badge>
  );
}
