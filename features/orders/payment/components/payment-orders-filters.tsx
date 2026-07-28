"use client";

import { FileText, Hand } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import ConfirmFilterButton from "@/components/confirm-filter-button";
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
import type {
  DeliveryStatus,
  PaymentOrdersFilterValues,
} from "@/features/orders/types";
import { cn } from "@/lib/utils";

type PaymentOrdersFiltersProps = {
  value: PaymentOrdersFilterValues;
  onChange: (next: PaymentOrdersFilterValues) => void;
  onApply: () => void;
};

const SELECT_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold text-brand-black outline-none focus:text-brand-black data-highlighted:text-brand-black [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

const DELIVERY_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-full border-none px-4 py-2.5 font-bold outline-none [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

const DELIVERY_OPTIONS: {
  value: "all" | DeliveryStatus;
  itemClassName: string;
  labelClassName: string;
  chevronClassName: string;
  showTruck?: boolean;
}[] = [
  {
    value: "all",
    itemClassName:
      "bg-[#F5F5F5] text-brand-black focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB] focus:text-brand-black data-highlighted:text-brand-black",
    labelClassName: "text-brand-black",
    chevronClassName: "text-brand-black",
  },
  {
    value: "required",
    itemClassName:
      "bg-brand-success-light text-brand-success focus:bg-[#C8F5DC] data-highlighted:bg-[#C8F5DC] focus:text-brand-success data-highlighted:text-brand-success",
    labelClassName: "text-brand-success",
    chevronClassName: "text-brand-success",
    showTruck: true,
  },
  {
    value: "notRequired",
    itemClassName:
      "bg-[#F5F5F5] text-brand-gris focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB] focus:text-brand-gris data-highlighted:text-brand-gris",
    labelClassName: "text-brand-gris",
    chevronClassName: "text-brand-gris",
  },
];

function SelectOption({
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

function DeliveryOption({
  label,
  labelClassName,
  chevronClassName,
  showTruck,
}: {
  label: string;
  labelClassName: string;
  chevronClassName: string;
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

export default function PaymentOrdersFilters({
  value,
  onChange,
  onApply,
}: PaymentOrdersFiltersProps) {
  const t = useTranslations("Orders.Payment");

  return (
    <div className="flex flex-wrap items-end gap-3">
      <DateField
        label={t("filters.createdAt")}
        placeholder={t("filters.pickDate")}
        value={value.createdAt}
        valueAs="date"
        maxDate={value.contractUploadedAt}
        onChange={(createdAt) =>
          onChange({
            ...value,
            createdAt: createdAt instanceof Date ? createdAt : undefined,
          })
        }
        className="min-w-[150px] flex-1 sm:flex-none sm:w-[160px]"
      />
      <DateField
        label={t("filters.contractUploadedAt")}
        placeholder={t("filters.pickDate")}
        value={value.contractUploadedAt}
        valueAs="date"
        minDate={value.createdAt}
        onChange={(contractUploadedAt) =>
          onChange({
            ...value,
            contractUploadedAt:
              contractUploadedAt instanceof Date
                ? contractUploadedAt
                : undefined,
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
              orderType: orderType as PaymentOrdersFilterValues["orderType"],
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
                  SELECT_ITEM_CLASS,
                  "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]"
                )}
              >
                <SelectOption label={t("filters.typeAll")} />
              </SelectItem>
              <SelectItem
                value="eform"
                className={cn(
                  SELECT_ITEM_CLASS,
                  "bg-[#FDEAF7] focus:bg-[#F9D6EE] data-highlighted:bg-[#F9D6EE]"
                )}
              >
                <SelectOption
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
                  SELECT_ITEM_CLASS,
                  "bg-[#E8F9E8] focus:bg-[#D6F2D6] data-highlighted:bg-[#D6F2D6]"
                )}
              >
                <SelectOption
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
                deliveryStatus as PaymentOrdersFilterValues["deliveryStatus"],
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
                    chevronClassName={option.chevronClassName}
                    showTruck={option.showTruck}
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
