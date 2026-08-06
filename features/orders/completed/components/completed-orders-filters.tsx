"use client";

import { useTranslations } from "next-intl";

import FilterActionButtons from "@/components/filter-action-buttons";
import CustomIcon from "@/components/custom-svg";
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
  CompletedOrdersFilterValues,
  DeliveryStatus,
  PaymentMethod,
} from "@/features/orders/types";
import { cn } from "@/lib/utils";

type CompletedOrdersFiltersProps = {
  value: CompletedOrdersFilterValues;
  onChange: (next: CompletedOrdersFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
};

const DELIVERY_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-full border-none px-4 py-2.5 font-bold outline-none [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

const DELIVERY_OPTIONS: {
  value: "all" | DeliveryStatus;
  itemClassName: string;
  labelClassName: string;
  showTruck?: boolean;
}[] = [
  {
    value: "all",
    itemClassName:
      "bg-[#F5F5F5] text-brand-black focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB] focus:text-brand-black data-highlighted:text-brand-black",
    labelClassName: "text-brand-black",
  },
  {
    value: "required",
    itemClassName:
      "bg-brand-success-light text-brand-success focus:bg-[#C8F5DC] data-highlighted:bg-[#C8F5DC] focus:text-brand-success data-highlighted:text-brand-success",
    labelClassName: "text-brand-success",
    showTruck: true,
  },
  {
    value: "notRequired",
    itemClassName:
      "bg-[#F5F5F5] text-brand-gris focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB] focus:text-brand-gris data-highlighted:text-brand-gris",
    labelClassName: "text-brand-gris",
  },
];

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
    value: "online",
    itemClassName:
      "bg-[#8B6BB5]/15 text-[#8B6BB5] focus:bg-[#8B6BB5]/25 data-highlighted:bg-[#8B6BB5]/25 focus:text-[#8B6BB5] data-highlighted:text-[#8B6BB5]",
    labelClassName: "text-[#8B6BB5]",
  },
  {
    value: "manual",
    itemClassName:
      "bg-brand-warning/15 text-brand-warning focus:bg-brand-warning/25 data-highlighted:bg-brand-warning/25 focus:text-brand-warning data-highlighted:text-brand-warning",
    labelClassName: "text-brand-warning",
  },
];

function DeliveryOption({
  label,
  labelClassName,
  showTruck,
}: {
  label: string;
  labelClassName: string;
  showTruck?: boolean;
}) {
  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span className={cn("flex items-center gap-2", labelClassName)}>
        {showTruck ? (
          <CustomIcon
            src="/svg/truck.svg"
            size={16}
            className="shrink-0 text-brand-success"
          />
        ) : null}
        <span>{label}</span>
      </span>
    </span>
  );
}

export default function CompletedOrdersFilters({
  value,
  onChange,
  onApply,
  onClear,
}: CompletedOrdersFiltersProps) {
  const t = useTranslations("Orders.Completed");

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
          {t("filters.deliveryStatus")}
        </span>
        <Select
          value={value.deliveryStatus}
          onValueChange={(deliveryStatus) =>
            onChange({
              ...value,
              deliveryStatus:
                deliveryStatus as CompletedOrdersFilterValues["deliveryStatus"],
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-44">
            <SelectValue placeholder={t("filters.deliveryStatus")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[12rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              {DELIVERY_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn(DELIVERY_ITEM_CLASS, option.itemClassName)}
                >
                  <DeliveryOption
                    label={
                      option.value === "all"
                        ? t("filters.deliveryAll")
                        : option.value === "required"
                          ? t("filters.deliveryRequired")
                          : t("filters.deliveryNotRequired")
                    }
                    labelClassName={option.labelClassName}
                    showTruck={option.showTruck}
                  />
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

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
                paymentMethod as CompletedOrdersFilterValues["paymentMethod"],
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
                  className={cn(DELIVERY_ITEM_CLASS, option.itemClassName)}
                >
                  <span
                    className={cn(
                      "flex w-full items-center gap-2",
                      option.labelClassName
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

      <FilterActionButtons
        applyLabel={t("filters.apply")}
        onApply={onApply}
        onClear={onClear}
      />
    </div>
  );
}
