"use client";

import { useTranslations } from "next-intl";

import ConfirmFilterButton from "@/components/confirm-filter-button";
import SearchBar from "@/components/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CityFilterValues } from "@/features/cities/types";
import { cn } from "@/lib/utils";

type CitiesFiltersProps = {
  value: CityFilterValues;
  onChange: (next: CityFilterValues) => void;
  onApply: () => void;
};

const STATUS_OPTIONS: {
  value: CityFilterValues["status"];
  itemClassName: string;
}[] = [
  {
    value: "all",
    itemClassName:
      "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]",
  },
  {
    value: "active",
    itemClassName:
      "bg-brand-success-light focus:bg-brand-success-light data-highlighted:bg-brand-success-light",
  },
  {
    value: "inactive",
    itemClassName:
      "bg-brand-light-yellow focus:bg-[#FDE5C8] data-highlighted:bg-[#FDE5C8]",
  },
];

const STATUS_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold text-brand-black outline-none focus:text-brand-black data-highlighted:text-brand-black [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

export default function CitiesFilters({
  value,
  onChange,
  onApply,
}: CitiesFiltersProps) {
  const t = useTranslations("Cities");

  return (
    <div className="flex w-full min-w-0 flex-wrap items-end gap-3 sm:w-auto sm:flex-1 sm:justify-end">
      <div className="flex min-w-0 flex-1 items-end gap-2 sm:max-w-xl">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="px-1 text-xs font-semibold text-brand-black">
            {t("filters.searchLabel")}
          </span>
          <SearchBar
            placeholder={t("filters.searchPlaceholder")}
            className="h-11 w-full max-w-none"
            value={value.search}
            onChange={(event) =>
              onChange({ ...value, search: event.target.value })
            }
          />
        </div>

        <div className="flex w-36 shrink-0 flex-col gap-1.5 sm:w-40">
          <span className="px-1 text-xs font-semibold text-brand-black">
            {t("filters.status")}
          </span>
          <Select
            value={value.status}
            onValueChange={(status) =>
              onChange({
                ...value,
                status: status as CityFilterValues["status"],
              })
            }
          >
            <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black">
              <SelectValue placeholder={t("filters.status")} />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="center"
              className="min-w-[12rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
            >
              <div className="flex flex-col gap-2">
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={cn(STATUS_ITEM_CLASS, option.itemClassName)}
                  >
                    {option.value === "all"
                      ? t("filters.statusAll")
                      : option.value === "active"
                        ? t("filters.statusActive")
                        : t("filters.statusInactive")}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ConfirmFilterButton
        label={t("filters.apply")}
        onClick={onApply}
        className="w-full sm:w-auto"
      />
    </div>
  );
}
