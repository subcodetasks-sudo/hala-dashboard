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
import OrderTypeFilter from "@/features/orders/components/order-type-filter";
import type {
  InvoiceContractStatus,
  InvoicesFilterValues,
  PaymentMethod,
} from "@/features/invoices/types";
import { cn } from "@/lib/utils";

type InvoicesFiltersProps = {
  value: InvoicesFilterValues;
  onChange: (next: InvoicesFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
};

const SELECT_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold outline-none [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

const PAYMENT_OPTIONS: {
  value: "all" | PaymentMethod;
  itemClassName: string;
  labelClassName: string;
}[] = [
  {
    value: "all",
    itemClassName:
      "bg-[#F5F5F5] text-brand-black focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB] focus:text-brand-black data-highlighted:text-brand-black",
    labelClassName: "text-brand-black",
  },
  {
    value: "manual",
    itemClassName:
      "bg-brand-purple/15 text-brand-purple focus:bg-brand-purple/25 data-highlighted:bg-brand-purple/25 focus:text-brand-purple data-highlighted:text-brand-purple",
    labelClassName: "text-brand-purple",
  },
  {
    value: "online",
    itemClassName:
      "bg-brand-light-yellow text-brand-warning focus:bg-brand-warning/15 data-highlighted:bg-brand-warning/15 focus:text-brand-warning data-highlighted:text-brand-warning",
    labelClassName: "text-brand-warning",
  },
];

const CONTRACT_ITEM_CLASS = cn(
  SELECT_ITEM_CLASS,
  "text-brand-black focus:text-brand-black data-highlighted:text-brand-black bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]",
);

const CONTRACT_STATUSES = [
  "available",
  "temporarily_unavailable",
] as const satisfies readonly InvoiceContractStatus[];

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

export default function InvoicesFilters({
  value,
  onChange,
  onApply,
  onClear,
}: InvoicesFiltersProps) {
  const t = useTranslations("Invoices");

  return (
    <div className="flex flex-wrap items-end gap-3">
      <DateField
        label={t("filters.paidAt")}
        placeholder={t("filters.pickDate")}
        value={value.paidAt}
        valueAs="date"
        onChange={(paidAt) =>
          onChange({
            ...value,
            paidAt: paidAt instanceof Date ? paidAt : undefined,
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
          {t("filters.paymentMethod")}
        </span>
        <Select
          value={value.paymentMethod}
          onValueChange={(paymentMethod) =>
            onChange({
              ...value,
              paymentMethod:
                paymentMethod as InvoicesFilterValues["paymentMethod"],
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-44">
            <SelectValue placeholder={t("filters.paymentMethod")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[12rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              {PAYMENT_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn(SELECT_ITEM_CLASS, option.itemClassName)}
                >
                  <span
                    className={cn(
                      "flex w-full items-center gap-2",
                      option.labelClassName,
                    )}
                  >
                    {option.value === "all"
                      ? t("filters.paymentAll")
                      : option.value === "online"
                        ? t("filters.paymentOnline")
                        : t("filters.paymentManual")}
                  </span>
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="px-1 text-xs font-semibold text-brand-black">
          {t("filters.contract")}
        </span>
        <Select
          value={value.contractStatus}
          onValueChange={(contractStatus) =>
            onChange({
              ...value,
              contractStatus:
                contractStatus as InvoicesFilterValues["contractStatus"],
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-44">
            <SelectValue placeholder={t("filters.contract")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[14rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              <SelectItem value="all" className={CONTRACT_ITEM_CLASS}>
                <SelectOption label={t("filters.contractAll")} />
              </SelectItem>
              {CONTRACT_STATUSES.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className={CONTRACT_ITEM_CLASS}
                >
                  <SelectOption
                    label={
                      status === "available"
                        ? t("filters.contractAvailable")
                        : t("filters.contractUnavailable")
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
