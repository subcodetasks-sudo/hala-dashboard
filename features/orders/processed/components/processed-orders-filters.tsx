"use client";

import { useTranslations } from "next-intl";

import ConfirmFilterButton from "@/components/confirm-filter-button";
import DateField from "@/components/date-field";
import SearchBar from "@/components/search-bar";
import OrderTypeFilter from "@/features/orders/components/order-type-filter";
import type { ProcessedOrdersFilterValues } from "@/features/orders/types";

type ProcessedOrdersFiltersProps = {
  value: ProcessedOrdersFilterValues;
  onChange: (next: ProcessedOrdersFilterValues) => void;
  onApply: () => void;
};

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

      <OrderTypeFilter
        value={value.orderType}
        onChange={(orderType) => onChange({ ...value, orderType })}
        label={t("filters.orderType")}
        allLabel={t("filters.typeAll")}
        eformLabel={t("filters.typeEform")}
        manualLabel={t("filters.typeManual")}
      />

      <ConfirmFilterButton label={t("filters.apply")} onClick={onApply} />
    </div>
  );
}
