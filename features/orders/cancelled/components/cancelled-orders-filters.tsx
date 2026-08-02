"use client";

import { ChevronLeft } from "lucide-react";
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
import { useCancellationReasons } from "@/features/orders/cancelled/queries/use-cancellation-reasons";
import { useCancellationSources } from "@/features/orders/cancelled/queries/use-cancellation-sources";
import CancellationSourceVisual from "@/features/orders/cancelled/components/cancellation-source-visual";
import { getCancellationSourceStyle } from "@/features/orders/cancelled/utils/cancellation-source-styles";
import OrderTypeFilter from "@/features/orders/components/order-type-filter";
import type { CancelledOrdersFilterValues } from "@/features/orders/types";
import { cn } from "@/lib/utils";

type CancelledOrdersFiltersProps = {
  value: CancelledOrdersFilterValues;
  onChange: (next: CancelledOrdersFilterValues) => void;
  onApply: () => void;
};

const SELECT_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold text-brand-black outline-none focus:text-brand-black data-highlighted:text-brand-black [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

const REASON_ITEM_CLASS = cn(
  SELECT_ITEM_CLASS,
  "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]",
);

function SelectOption({
  label,
  icon,
  labelClassName,
}: {
  label: string;
  icon?: ReactNode;
  labelClassName?: string;
}) {
  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span className={cn("flex items-center gap-2", labelClassName ?? "text-brand-black")}>
        {icon}
        <span>{label}</span>
      </span>
      <ChevronLeft
        className="size-4 shrink-0 text-brand-black ltr:rotate-180 [[data-slot=select-value]_&]:hidden"
        strokeWidth={1.75}
        aria-hidden
      />
    </span>
  );
}

export default function CancelledOrdersFilters({
  value,
  onChange,
  onApply,
}: CancelledOrdersFiltersProps) {
  const t = useTranslations("Orders.Cancelled");
  const {
    data: cancellationSources = [],
    isLoading: isSourcesLoading,
  } = useCancellationSources();
  const {
    data: cancellationReasons = [],
    isLoading: isReasonsLoading,
  } = useCancellationReasons();

  return (
    <div className="flex flex-wrap items-end gap-3">
      <DateField
        label={t("filters.cancelledAt")}
        placeholder={t("filters.pickDate")}
        value={value.cancelledAt}
        valueAs="date"
        onChange={(cancelledAt) =>
          onChange({
            ...value,
            cancelledAt: cancelledAt instanceof Date ? cancelledAt : undefined,
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

      <OrderTypeFilter
        value={value.orderType}
        onChange={(orderType) => onChange({ ...value, orderType })}
        label={t("filters.orderType")}
        allLabel={t("filters.typeAll")}
        eformLabel={t("filters.typeEform")}
        manualLabel={t("filters.typeManual")}
      />

      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="px-1 text-xs font-semibold text-brand-black">
          {t("filters.cancellationSource")}
        </span>
        <Select
          value={value.cancellationSource}
          onValueChange={(cancellationSource) =>
            onChange({
              ...value,
              cancellationSource,
            })
          }
          disabled={isSourcesLoading}
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-44">
            <SelectValue placeholder={t("filters.cancellationSource")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[14rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              <SelectItem
                value="all"
                className={cn(
                  SELECT_ITEM_CLASS,
                  "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]",
                )}
              >
                <SelectOption label={t("filters.sourceAll")} />
              </SelectItem>
              {cancellationSources.map((source) => {
                const style = getCancellationSourceStyle(source.value);

                return (
                  <SelectItem
                    key={source.value}
                    value={source.value}
                    className={cn(SELECT_ITEM_CLASS, style.itemClassName)}
                  >
                    <span className="flex w-full items-center justify-between gap-3">
                      <CancellationSourceVisual
                        source={source.value}
                        label={source.label}
                      />
                      <ChevronLeft
                        className="size-4 shrink-0 text-brand-black ltr:rotate-180 [[data-slot=select-value]_&]:hidden"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </span>
                  </SelectItem>
                );
              })}
            </div>
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="px-1 text-xs font-semibold text-brand-black">
          {t("filters.cancellationReason")}
        </span>
        <Select
          value={value.cancellationReason}
          onValueChange={(cancellationReason) =>
            onChange({
              ...value,
              cancellationReason,
            })
          }
          disabled={isReasonsLoading}
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-48">
            <SelectValue placeholder={t("filters.cancellationReason")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[14rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="no-scrollbar flex max-h-64 flex-col gap-2 overflow-y-auto">
              <SelectItem value="all" className={REASON_ITEM_CLASS}>
                <SelectOption label={t("filters.reasonAll")} />
              </SelectItem>
              {cancellationReasons.map((reason) => (
                <SelectItem
                  key={reason.value}
                  value={reason.value}
                  className={REASON_ITEM_CLASS}
                >
                  <SelectOption label={reason.label} />
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
