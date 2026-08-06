"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import FilterActionButtons from "@/components/filter-action-buttons";
import SearchBar from "@/components/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  PermissionRoleKey,
  PermissionRoleStatus,
  PermissionsFilterValues,
} from "@/features/permissions/types";
import { getRoleBadgeStyle } from "@/features/permissions/role-ui-config";
import { cn } from "@/lib/utils";

type RoleFilterOption = {
  name: string;
  label: string;
  roleKey: PermissionRoleKey | null;
};

type PermissionsFiltersProps = {
  value: PermissionsFilterValues;
  roleOptions: RoleFilterOption[];
  onChange: (next: PermissionsFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
};

const SELECT_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold outline-none [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

const STATUS_FILTER_OPTIONS: {
  value: PermissionsFilterValues["status"];
  itemClassName: string;
}[] = [
  {
    value: "all",
    itemClassName:
      "bg-[#F5F5F5] text-brand-black focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB] focus:text-brand-black data-highlighted:text-brand-black",
  },
  {
    value: "active",
    itemClassName:
      "bg-brand-success-light text-brand-success focus:bg-brand-success-light data-highlighted:bg-brand-success-light focus:text-brand-success data-highlighted:text-brand-success",
  },
  {
    value: "inactive",
    itemClassName:
      "bg-brand-error/10 text-brand-error focus:bg-brand-error/15 data-highlighted:bg-brand-error/15 focus:text-brand-error data-highlighted:text-brand-error",
  },
];

function SelectOption({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex w-full items-center justify-between gap-3",
        className,
      )}
    >
      <span>{label}</span>
      <ChevronLeft
        className={cn(
          "size-4 shrink-0 ltr:rotate-180 [[data-slot=select-value]_&]:hidden",
          className,
        )}
        strokeWidth={1.75}
        aria-hidden
      />
    </span>
  );
}

export default function PermissionsFilters({
  value,
  roleOptions,
  onChange,
  onApply,
  onClear,
}: PermissionsFiltersProps) {
  const t = useTranslations("Permissions");

  const selectedRoleLabel =
    value.role === "all"
      ? t("filters.roleAll")
      : (roleOptions.find((role) => role.name === value.role)?.label ??
        value.role);

  const statusLabel = (statusValue: PermissionRoleStatus | "all") => {
    if (statusValue === "all") return t("filters.statusAll");
    if (statusValue === "active") return t("filters.statusActive");
    return t("filters.statusInactive");
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
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
              role: role ?? "all",
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-44">
            <SelectValue placeholder={t("filters.role")}>
              {selectedRoleLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[16rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
              <SelectItem
                value="all"
                className={cn(
                  SELECT_ITEM_CLASS,
                  "bg-[#F5F5F5] text-brand-black focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB] focus:text-brand-black data-highlighted:text-brand-black",
                )}
              >
                <SelectOption label={t("filters.roleAll")} />
              </SelectItem>
              {roleOptions.map((option) => (
                <SelectItem
                  key={option.name}
                  value={option.name}
                  className={cn(
                    SELECT_ITEM_CLASS,
                    getRoleBadgeStyle(option.roleKey),
                    "focus:opacity-90 data-highlighted:opacity-90",
                  )}
                >
                  <SelectOption label={option.label} />
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
              status: (status ?? "all") as PermissionsFilterValues["status"],
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-44">
            <SelectValue placeholder={t("filters.status")}>
              {statusLabel(value.status)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[12rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              {STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn(SELECT_ITEM_CLASS, option.itemClassName)}
                >
                  <SelectOption label={statusLabel(option.value)} />
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
