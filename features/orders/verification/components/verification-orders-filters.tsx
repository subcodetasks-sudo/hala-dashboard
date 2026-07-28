"use client";

import { FileCheck, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import ConfirmFilterButton from "@/components/confirm-filter-button";
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
  VerificationOrderStatus,
  VerificationOrdersFilterValues,
} from "@/features/orders/types";
import { cn } from "@/lib/utils";

type VerificationOrdersFiltersProps = {
  value: VerificationOrdersFilterValues;
  onChange: (next: VerificationOrdersFilterValues) => void;
  onApply: () => void;
};

const STATUS_OPTIONS: {
  value: "all" | VerificationOrderStatus;
  itemClassName: string;
  icon?: ReactNode;
}[] = [
  {
    value: "all",
    itemClassName:
      "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]",
  },
  {
    value: "sentForVerification",
    itemClassName:
      "bg-[#F3EDF8] focus:bg-[#E8DCF2] data-highlighted:bg-[#E8DCF2]",
    icon: <Send className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  {
    value: "finalContractUploaded",
    itemClassName:
      "bg-brand-light-yellow focus:bg-[#FDE5C8] data-highlighted:bg-[#FDE5C8]",
    icon: <FileCheck className="size-4 shrink-0" strokeWidth={1.75} />,
  },
];

const STATUS_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold text-brand-black outline-none focus:text-brand-black data-highlighted:text-brand-black [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

function StatusOption({
  label,
  icon,
}: {
  label: string;
  icon?: ReactNode;
}) {
  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </span>
    </span>
  );
}

export default function VerificationOrdersFilters({
  value,
  onChange,
  onApply,
}: VerificationOrdersFiltersProps) {
  const t = useTranslations("Orders.Verification");

  return (
    <div className="flex flex-wrap items-end gap-3">
      <DateField
        label={t("filters.fromDate")}
        placeholder={t("filters.pickDate")}
        value={value.fromDate}
        valueAs="date"
        maxDate={value.toDate}
        onChange={(fromDate) =>
          onChange({
            ...value,
            fromDate: fromDate instanceof Date ? fromDate : undefined,
          })
        }
        className="min-w-[150px] flex-1 sm:flex-none sm:w-[160px]"
      />
      <DateField
        label={t("filters.toDate")}
        placeholder={t("filters.pickDate")}
        value={value.toDate}
        valueAs="date"
        minDate={value.fromDate}
        onChange={(toDate) =>
          onChange({
            ...value,
            toDate: toDate instanceof Date ? toDate : undefined,
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
          {t("filters.status")}
        </span>
        <Select
          value={value.status}
          onValueChange={(status) =>
            onChange({
              ...value,
              status: status as VerificationOrdersFilterValues["status"],
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-48">
            <SelectValue placeholder={t("filters.status")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[14rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn(STATUS_ITEM_CLASS, option.itemClassName)}
                >
                  <StatusOption
                    label={
                      option.value === "all"
                        ? t("filters.statusAll")
                        : option.value === "sentForVerification"
                          ? t("filters.statusSentForVerification")
                          : t("filters.statusFinalContractUploaded")
                    }
                    icon={option.icon}
                  />
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <ConfirmFilterButton label={t("filters.apply")} onClick={onApply} />
    </div>
  );
}
