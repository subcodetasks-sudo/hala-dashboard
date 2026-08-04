"use client";

import { useTranslations } from "next-intl";

import ConfirmFilterButton from "@/components/confirm-filter-button";
import DateField from "@/components/date-field";
import SearchBar from "@/components/search-bar";
import SelectField from "@/components/select-field";
import type { TrackingFilterValues } from "@/features/tracking/types";

type TrackingFiltersProps = {
  value: TrackingFilterValues;
  onChange: (next: TrackingFilterValues) => void;
  onApply: () => void;
};

export default function TrackingFilters({
  value,
  onChange,
  onApply,
}: TrackingFiltersProps) {
  const t = useTranslations("Tracking.filters");

  const statusOptions = [
    { value: "all", label: t("all") },
    { value: "available", label: t("statusAvailable") },
    { value: "used", label: t("statusUsed") },
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
      <div className="w-full sm:w-[160px]">
        <SelectField
          id="tracking-status-filter"
          label={t("status")}
          iconSrc="/svg/location.svg"
          value={value.status}
          options={statusOptions}
          onChange={(status) => onChange({ ...value, status })}
          readOnly={false}
        />
      </div>

      {/* Dropdown: Shipping Company */}
      <div className="w-full sm:w-[170px]">
        <SelectField
          id="tracking-company-filter"
          label={t("shippingCompany")}
          iconSrc="/svg/truck.svg"
          value={value.shippingCompany}
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
