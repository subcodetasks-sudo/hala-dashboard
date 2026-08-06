"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import FilterActionButtons from "@/components/filter-action-buttons";
import DateField from "@/components/date-field";
import SearchBar from "@/components/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EmployeeAccountStatus,
  EmployeeJobRole,
  EmployeesFilterValues,
} from "@/features/employees/types";
import { cn } from "@/lib/utils";

type EmployeesFiltersProps = {
  value: EmployeesFilterValues;
  onChange: (next: EmployeesFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
};

const SELECT_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold outline-none [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

const ROLE_ITEM_CLASS = cn(
  SELECT_ITEM_CLASS,
  "text-brand-black focus:text-brand-black data-highlighted:text-brand-black bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]",
);

const JOB_ROLES = [
  "review",
  "dataProcessing",
  "contractFollowUp",
] as const satisfies readonly EmployeeJobRole[];

const ACCOUNT_STATUSES = [
  "active",
  "suspended",
] as const satisfies readonly EmployeeAccountStatus[];

function SelectOption({ label }: { label: string }) {
  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span className="text-brand-black">{label}</span>
      <ChevronLeft
        className="size-4 shrink-0 text-brand-black ltr:rotate-180 [[data-slot=select-value]_&]:hidden"
        strokeWidth={1.75}
        aria-hidden
      />
    </span>
  );
}

export default function EmployeesFilters({
  value,
  onChange,
  onApply,
  onClear,
}: EmployeesFiltersProps) {
  const t = useTranslations("Employees");

  return (
    <div className="flex flex-wrap items-end gap-3">
      <DateField
        label={t("filters.createdAt")}
        placeholder={t("filters.pickDate")}
        value={value.createdAt}
        valueAs="date"
        onChange={(createdAt) =>
          onChange({
            ...value,
            createdAt: createdAt instanceof Date ? createdAt : undefined,
          })
        }
        className="min-w-[150px] flex-1 sm:flex-none sm:w-[160px]"
      />

      <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
        <span className="px-1 text-xs font-semibold text-brand-black">
          {t("filters.searchLabel")}
        </span>
        <SearchBar
          placeholder={t("filters.searchPlaceholder")}
          className="h-11 w-full max-w-none sm:w-full md:w-full"
          value={value.search}
          onChange={(event) =>
            onChange({ ...value, search: event.target.value })
          }
        />
      </div>

      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="px-1 text-xs font-semibold text-brand-black">
          {t("filters.role")}
        </span>
        <Select
          value={value.role}
          onValueChange={(role) =>
            onChange({
              ...value,
              role: role as EmployeesFilterValues["role"],
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-44">
            <SelectValue placeholder={t("filters.role")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[14rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              <SelectItem value="all" className={ROLE_ITEM_CLASS}>
                <SelectOption label={t("filters.roleAll")} />
              </SelectItem>
              {JOB_ROLES.map((role) => (
                <SelectItem key={role} value={role} className={ROLE_ITEM_CLASS}>
                  <SelectOption label={t(`filters.roles.${role}`)} />
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="px-1 text-xs font-semibold text-brand-black">
          {t("filters.status")}
        </span>
        <Select
          value={value.status}
          onValueChange={(status) =>
            onChange({
              ...value,
              status: status as EmployeesFilterValues["status"],
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-44">
            <SelectValue placeholder={t("filters.status")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[12rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              <SelectItem value="all" className={ROLE_ITEM_CLASS}>
                <SelectOption label={t("filters.statusAll")} />
              </SelectItem>
              {ACCOUNT_STATUSES.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className={ROLE_ITEM_CLASS}
                >
                  <SelectOption
                    label={
                      status === "active"
                        ? t("filters.statusActive")
                        : t("filters.statusSuspended")
                    }
                  />
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <FilterActionButtons
        applyLabel={t("filters.apply")}
        onApply={onApply}
        onClear={onClear}
      />
    </div>
  );
}
