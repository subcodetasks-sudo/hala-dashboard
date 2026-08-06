"use client";

import { useTranslations } from "next-intl";

import FilterActionButtons from "@/components/filter-action-buttons";
import DateField from "@/components/date-field";
import SearchBar from "@/components/search-bar";
import type { VerificationOrdersFilterValues } from "@/features/orders/types";

type VerificationOrdersFiltersProps = {
  value: VerificationOrdersFilterValues;
  onChange: (next: VerificationOrdersFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
};

export default function VerificationOrdersFilters({
  value,
  onChange,
  onApply,
  onClear,
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

      <FilterActionButtons
        applyLabel={t("filters.apply")}
        onApply={onApply}
        onClear={onClear}
      />
    </div>
  );
}
