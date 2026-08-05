"use client";

import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import ConfirmFilterButton from "@/components/confirm-filter-button";
import CustomIcon from "@/components/custom-svg";
import DateField from "@/components/date-field";
import SearchBar from "@/components/search-bar";
import SelectField from "@/components/select-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TrackingFilterValues } from "@/features/tracking/types";
import { cn } from "@/lib/utils";

type TrackingFiltersProps = {
  value: TrackingFilterValues;
  onChange: (next: TrackingFilterValues) => void;
  onApply: () => void;
};

const STATUS_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold outline-none [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full [&>span:last-child]:items-center [&>span:last-child]:gap-2";

export default function TrackingFilters({
  value,
  onChange,
  onApply,
}: TrackingFiltersProps) {
  const t = useTranslations("Tracking.filters");

  const statusOptions = [
    {
      value: "all",
      label: t("all"),
      icon: null,
      itemClassName:
        "bg-[#F5F5F5] text-brand-black focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB] focus:text-brand-black data-highlighted:text-brand-black",
    },
    {
      value: "available",
      label: t("statusAvailable"),
      icon: (
        <CircleCheck
          className="size-4 shrink-0 text-brand-primary"
          strokeWidth={2}
          aria-hidden
        />
      ),
      itemClassName:
        "bg-brand-primary/10 text-brand-primary focus:bg-brand-primary/15 data-highlighted:bg-brand-primary/15 focus:text-brand-primary data-highlighted:text-brand-primary",
    },
    {
      value: "used",
      label: t("statusUsed"),
      icon: (
        <CustomIcon
          src="/svg/mouse-circle.svg"
          size={16}
          className="shrink-0 text-brand-blue"
          aria-hidden
        />
      ),
      itemClassName:
        "bg-brand-blue/10 text-brand-blue focus:bg-brand-blue/15 data-highlighted:bg-brand-blue/15 focus:text-brand-blue data-highlighted:text-brand-blue",
    },
    {
      value: "disabled",
      label: t("statusDisabled"),
      icon: (
        <CustomIcon
          src="/svg/disabled.svg"
          size={16}
          className="shrink-0 text-destructive"
          aria-hidden
        />
      ),
      itemClassName:
        "bg-destructive/10 text-destructive focus:bg-destructive/15 data-highlighted:bg-destructive/15 focus:text-destructive data-highlighted:text-destructive",
    },
  ];

  const shippingCompanyOptions = [
    { value: "all", label: t("all") },
    { value: "aramex", label: "أرامكس (Aramex)" },
    { value: "smsa", label: "سمسا (SMSA)" },
    { value: "spl", label: "سبل (SPL)" },
    { value: "dhl", label: "DHL" },
  ];

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Date Field: Usage Date */}
      <div className="w-full sm:w-[170px]">
        <DateField
          label={t("usageDate")}
          value={value.usageDate}
          onChange={(date) =>
            onChange({
              ...value,
              usageDate: date ? new Date(date) : undefined,
            })
          }
        />
      </div>

      {/* Search Input */}
      <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
        <span className="px-1 text-xs font-semibold text-brand-black">
          {t("searchLabel")}
        </span>
        <SearchBar
          value={value.search}
          placeholder={t("searchPlaceholder")}
          className="h-11 w-full max-w-none sm:w-full md:w-full"
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </div>

      {/* Dropdown: Status */}
      <div className="flex w-full flex-col gap-1.5 sm:w-[160px]">
        <span className="px-1 text-xs font-semibold text-brand-black">
          {t("status")}
        </span>
        <Select
          value={value.status}
          onValueChange={(status) => onChange({ ...value, status })}
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-brand-gris-light px-3 text-sm font-semibold text-brand-black">
            <SelectValue placeholder={t("status")}>
              {
                statusOptions.find((option) => option.value === value.status)
                  ?.label
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="start"
            side="bottom"
            avoidCollisions={false}
            className="min-w-[12rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              {statusOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn(STATUS_ITEM_CLASS, option.itemClassName)}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      {/* Dropdown: Shipping Company */}
      <div className="w-full sm:w-[170px]">
        <SelectField
          id="tracking-company-filter"
          label={t("shippingCompany")}
          value={value.shippingCompany}
          iconSrc=""
          options={shippingCompanyOptions}
          onChange={(shippingCompany) =>
            onChange({ ...value, shippingCompany })
          }
          readOnly={false}
        />
      </div>

      {/* Apply Filter Button */}
      <div className="w-full sm:w-auto">
        <ConfirmFilterButton label={t("apply")} onClick={onApply} />
      </div>
    </div>
  );
}
