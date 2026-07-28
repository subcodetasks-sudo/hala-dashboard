"use client";

import { FileText, Hand } from "lucide-react";
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
import type { ProcessedOrdersFilterValues } from "@/features/orders/types";
import { cn } from "@/lib/utils";

type ProcessedOrdersFiltersProps = {
  value: ProcessedOrdersFilterValues;
  onChange: (next: ProcessedOrdersFilterValues) => void;
  onApply: () => void;
};

const TYPE_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold text-brand-black outline-none focus:text-brand-black data-highlighted:text-brand-black [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

function TypeOption({
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

export default function ProcessedOrdersFilters({
  value,
  onChange,
  onApply,
}: ProcessedOrdersFiltersProps) {
  const t = useTranslations("Orders.Processed");

  return (
    <div className="flex flex-wrap items-end gap-3">
      <DateField
        label={t("filters.fromDate")}
        placeholder={t("filters.pickDate")}
        value={value.fromDate}
        valueAs="date"
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
        onChange={(toDate) =>
          onChange({
            ...value,
            toDate: toDate instanceof Date ? toDate : undefined,
          })
        }
        className="min-w-[150px] flex-1 sm:flex-none sm:w-[160px]"
      />
      <DateField
        label={t("filters.expectedExecution")}
        placeholder={t("filters.pickDate")}
        value={value.expectedExecution}
        valueAs="date"
        onChange={(expectedExecution) =>
          onChange({
            ...value,
            expectedExecution:
              expectedExecution instanceof Date ? expectedExecution : undefined,
          })
        }
        className="min-w-[180px] flex-1 sm:flex-none sm:w-[200px]"
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
          {t("filters.orderType")}
        </span>
        <Select
          value={value.orderType}
          onValueChange={(orderType) =>
            onChange({
              ...value,
              orderType: orderType as ProcessedOrdersFilterValues["orderType"],
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-40">
            <SelectValue placeholder={t("filters.orderType")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[11.5rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              <SelectItem
                value="all"
                className={cn(
                  TYPE_ITEM_CLASS,
                  "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]"
                )}
              >
                <TypeOption label={t("filters.typeAll")} />
              </SelectItem>
              <SelectItem
                value="eform"
                className={cn(
                  TYPE_ITEM_CLASS,
                  "bg-[#FDEAF7] focus:bg-[#F9D6EE] data-highlighted:bg-[#F9D6EE]"
                )}
              >
                <TypeOption
                  label={t("filters.typeEform")}
                  icon={
                    <FileText
                      className="size-4 shrink-0 text-brand-black"
                      strokeWidth={1.75}
                    />
                  }
                />
              </SelectItem>
              <SelectItem
                value="manual"
                className={cn(
                  TYPE_ITEM_CLASS,
                  "bg-[#E8F9E8] focus:bg-[#D6F2D6] data-highlighted:bg-[#D6F2D6]"
                )}
              >
                <TypeOption
                  label={t("filters.typeManual")}
                  icon={
                    <Hand
                      className="size-4 shrink-0 text-brand-black"
                      strokeWidth={1.75}
                    />
                  }
                />
              </SelectItem>
            </div>
          </SelectContent>
        </Select>
      </div>

      <ConfirmFilterButton label={t("filters.apply")} onClick={onApply} />
    </div>
  );
}
