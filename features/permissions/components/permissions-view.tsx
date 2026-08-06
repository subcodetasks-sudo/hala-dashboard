"use client";

import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import EmptyTableState from "@/components/empty-table-state";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Button } from "@/components/ui/button";
import PermissionRoleCell from "@/features/permissions/components/permission-role-cell";
import PermissionRoleStatusBadge from "@/features/permissions/components/permission-role-status-badge";
import PermissionRowActions from "@/features/permissions/components/permission-row-actions";
import PermissionsFilters from "@/features/permissions/components/permissions-filters";
import { DEFAULT_PERMISSIONS_FILTERS } from "@/features/permissions/constants";
import { useRoles } from "@/features/permissions/queries";
import type {
  PermissionRoleRow,
  PermissionsFilterValues,
} from "@/features/permissions/types";
import { filterPermissionRoles } from "@/features/permissions/utils/map-role-to-row";
import { formatApiDateTime } from "@/lib/format-datetime";

export default function PermissionsView() {
  const t = useTranslations("Permissions");
  const locale = useLocale() === "en" ? "en" : "ar";
  const [draftFilters, setDraftFilters] = useState<PermissionsFilterValues>(
    DEFAULT_PERMISSIONS_FILTERS,
  );
  const [appliedFilters, setAppliedFilters] = useState<PermissionsFilterValues>(
    DEFAULT_PERMISSIONS_FILTERS,
  );

  const { data: roles = [], isLoading, isError, error } = useRoles();

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : t("loadError"),
      );
    }
  }, [error, isError, t]);

  const roleOptions = useMemo(
    () =>
      roles
        .filter((role) => !role.isProtected)
        .map((role) => ({
          name: role.name,
          label: role.label || role.name,
          roleKey: role.roleKey,
        })),
    [roles],
  );

  const rows = useMemo(
    () =>
      filterPermissionRoles(
        roles.filter((role) => !role.isProtected),
        appliedFilters,
      ),
    [appliedFilters, roles],
  );

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const handleClearFilters = () => {
    setDraftFilters(DEFAULT_PERMISSIONS_FILTERS);
    setAppliedFilters(DEFAULT_PERMISSIONS_FILTERS);
  };

  const columns: DataTableColumn<PermissionRoleRow>[] = [
    {
      id: "role",
      header: t("table.role"),
      cell: (row) => (
        <PermissionRoleCell
          label={row.label}
          name={row.name}
          roleKey={row.roleKey}
          subtitle={t("table.permissionsCount", {
            count: row.permissionsCount,
          })}
        />
      ),
    },
    {
      id: "permissionsCount",
      header: t("table.permissionsCountHeader"),
      cell: (row) => (
        <span className="font-clash font-semibold text-brand-black" dir="ltr">
          {String(row.permissionsCount).padStart(2, "0")}
        </span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => <PermissionRoleStatusBadge status={row.status} />,
    },
    {
      id: "updatedAt",
      header: t("table.updatedAt"),
      cell: (row) => {
        const updated = formatApiDateTime(row.updatedAtDateTime, locale);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{updated.dateLabel}</span>
            <span className="text-xs text-brand-gris">{updated.timeLabel}</span>
          </div>
        );
      },
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <PermissionRowActions role={row} />,
    },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-8 p-4 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-brand-black md:text-3xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-sm text-brand-gris">{t("description")}</p>
        </div>

        <Button
          asChild
          type="button"
          variant="outline"
          className="h-11 shrink-0 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
        >
          <Link href="/permissions/new">
            <Plus className="size-4" strokeWidth={2} />
            <span>{t("addRole")}</span>
          </Link>
        </Button>
      </div>

      <section className="flex flex-col gap-4">
        <PermissionsFilters
          value={draftFilters}
          roleOptions={roleOptions}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          selectable
          isLoading={isLoading}
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/profile-tick.svg"
              title={t("empty.title")}
              description={t("empty.description")}
            />
          }
        />
      </section>
    </div>
  );
}
