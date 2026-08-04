"use client";

import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EmployeeActions from "@/features/employees/components/employee-actions";
import EmployeeFormDialog from "@/features/employees/components/employee-form-dialog";
import EmployeeRoleBadge from "@/features/employees/components/employee-role-badge";
import EmployeeStatusBadge from "@/features/employees/components/employee-status-badge";
import EmployeesFilters from "@/features/employees/components/employees-filters";
import { CopyableEmail } from "@/features/employees/components/copyable-email";
import { CopyableEmployeeNumber } from "@/features/employees/components/copyable-employee-number";
import { DEFAULT_EMPLOYEES_FILTERS } from "@/features/employees/constants";
import { useAdmins } from "@/features/employees/queries/use-admins";
import { useEmployeeIndicators } from "@/features/employees/queries/use-employee-indicators";
import type { EmployeeRow } from "@/features/employees/types";
import { mapAdminToEmployeeRow } from "@/features/employees/utils/map-admin-to-employee-row";
import {
  parseEmployeesFilters,
  serializeEmployeesFilters,
} from "@/features/employees/utils/filter-query-params";
import { toAdminsListFilters } from "@/features/employees/utils/to-admins-list-filters";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import { useUrlFilters } from "@/hooks/use-url-filters";
import {
  formatChangePercent,
  formatStatsCount,
} from "@/lib/format-stats";
import {
  formatIsoDateWithClockTime,
  formatRelativeTimeLabel,
} from "@/lib/format-datetime";

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "total" as const,
    iconSrc: "/svg/profile-2user.svg",
    bgClassName: "bg-brand-primary/10",
    valueClassName: "text-brand-dark-blue",
  },
  {
    key: "active" as const,
    iconSrc: "/svg/person.svg",
    bgClassName: "bg-brand-light-yellow",
    valueClassName: "text-brand-dark-blue",
  },
  {
    key: "suspended" as const,
    iconSrc: "/svg/profile-delete.svg",
    // Soft pink wash — no brand token for this pastel (same as content drafts card)
    bgClassName: "bg-[#FDEAF7]",
    valueClassName: "text-brand-dark-blue",
  },
] as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
}

export default function EmployeesView() {
  const t = useTranslations("Employees");
  const locale = useLocale() === "en" ? "en" : "ar";
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useUrlFilters({
      defaults: DEFAULT_EMPLOYEES_FILTERS,
      serialize: serializeEmployeesFilters,
      parse: parseEmployeesFilters,
    });

  const handleApplyFilters = () => {
    setPage(1);
    applyFilters();
  };

  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdmins(toAdminsListFilters(appliedFilters, { page }));

  const rows: EmployeeRow[] = (data?.items ?? []).map((admin) =>
    mapAdminToEmployeeRow(admin, locale),
  );

  const { data: indicators, isLoading: isStatsLoading } =
    useEmployeeIndicators();

  const columns: DataTableColumn<EmployeeRow>[] = [
    {
      id: "employeeNumber",
      header: t("table.employeeNumber"),
      cell: (row) => (
        <CopyableEmployeeNumber
          employeeNumber={row.employeeNumber}
          className="font-semibold text-brand-black"
        />
      ),
    },
    {
      id: "employee",
      header: t("table.employee"),
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm" className="size-10 shrink-0">
            {row.avatarUrl ? (
              <AvatarImage src={row.avatarUrl} alt={row.name} />
            ) : null}
            <AvatarFallback className="bg-brand-primary/15 text-xs font-semibold text-brand-primary">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-semibold text-brand-black">{row.name}</span>
            <CopyablePhoneNumber phone={row.phone} />
          </div>
        </div>
      ),
    },
    {
      id: "email",
      header: t("table.email"),
      cell: (row) => (
        <CopyableEmail
          email={row.email}
          className="whitespace-nowrap text-brand-black"
        />
      ),
    },
    {
      id: "role",
      header: t("table.role"),
      cell: (row) => <EmployeeRoleBadge role={row.role} />,
    },
    {
      id: "dailyTarget",
      header: t("table.dailyTarget"),
      cell: (row) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light-yellow px-3 py-1.5 text-sm font-bold text-brand-warning">
          <CustomIcon
            src="/svg/chart.svg"
            size={14}
            className="shrink-0 text-brand-warning"
          />
          <span className="font-clash" dir="ltr">
            {String(row.dailyTarget).padStart(2, "0")}
          </span>
        </span>
      ),
    },
    {
      id: "createdAt",
      header: t("table.createdAt"),
      cell: (row) => {
        const created = formatIsoDateWithClockTime(
          row.createdAtIso,
          row.createdTime,
          locale,
        );
        const relative = formatRelativeTimeLabel(
          row.createdAtDateTime,
          locale,
        );
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{created.dateLabel}</span>
            <span className="text-xs text-brand-gris">
              {created.timeLabel}
              {relative ? ` • ${relative}` : null}
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => <EmployeeStatusBadge status={row.status} />,
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <EmployeeActions employee={row} />,
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
          type="button"
          variant="outline"
          onClick={() => setCreateOpen(true)}
          className="h-11 shrink-0 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span>{t("addUser")}</span>
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {INDICATOR_CARDS.map((card) => (
          <InfoCard
            key={card.key}
            title={t(`indicators.${card.key}`)}
            value={formatStatsCount(indicators?.[card.key], isStatsLoading)}
            change={formatChangePercent(
              indicators?.changePercent,
              isStatsLoading,
            )}
            period={t("periodWeek")}
            iconSrc={card.iconSrc}
            bgClassName={card.bgClassName}
            valueClassName={card.valueClassName}
          />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/profile-2user.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <EmployeesFilters
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
        />

        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          selectable
          isLoading={isLoading}
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/profile-2user.svg"
              title={
                isError
                  ? error instanceof Error
                    ? error.message
                    : t("empty.title")
                  : t("empty.title")
              }
              description={isError ? " " : t("empty.description")}
            />
          }
        />

        <TablePagination
          page={data?.currentPage ?? page}
          lastPage={data?.lastPage ?? 1}
          total={data?.total}
          onPageChange={setPage}
        />
      </section>

      <EmployeeFormDialog
        open={isCreateOpen}
        onOpenChange={setCreateOpen}
        mode="create"
      />
    </div>
  );
}
