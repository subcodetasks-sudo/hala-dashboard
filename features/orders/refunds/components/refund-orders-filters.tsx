"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

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
import OrderTypeFilter from "@/features/orders/components/order-type-filter";
import type {
  OrderRefundMethod,
  OrderRefundStatus,
  RefundOrdersFilterValues,
} from "@/features/orders/types";
import { cn } from "@/lib/utils";

type RefundOrdersFiltersProps = {
  value: RefundOrdersFilterValues;
  onChange: (next: RefundOrdersFilterValues) => void;
  onApply: () => void;
};

const SELECT_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold text-brand-black outline-none focus:text-brand-black data-highlighted:text-brand-black [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

const MUTED_ITEM_CLASS = cn(
  SELECT_ITEM_CLASS,
  "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]",
);

/** Design shows Under Review + Refunded; keep those as the primary filters. */
const REFUND_STATUSES = [
  "pending",
  "completed",
] as const satisfies readonly OrderRefundStatus[];

const REFUND_METHODS = [
  "bank_transfer",
  "wallet",
  "cash",
] as const satisfies readonly OrderRefundMethod[];

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

export default function RefundOrdersFilters({
  value,
  onChange,
  onApply,
}: RefundOrdersFiltersProps) {
  const t = useTranslations("Orders.Refunds");

  return (
    <div className="flex flex-wrap items-end gap-3">
      <DateField
        label={t("filters.requestedAt")}
        placeholder={t("filters.pickDate")}
        value={value.requestedAt}
        valueAs="date"
        onChange={(requestedAt) =>
          onChange({
            ...value,
            requestedAt: requestedAt instanceof Date ? requestedAt : undefined,
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
          {t("filters.refundStatus")}
        </span>
        <Select
          value={value.refundStatus}
          onValueChange={(refundStatus) =>
            onChange({
              ...value,
              refundStatus:
                refundStatus as RefundOrdersFilterValues["refundStatus"],
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-44">
            <SelectValue placeholder={t("filters.refundStatus")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[14rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              <SelectItem value="all" className={MUTED_ITEM_CLASS}>
                <SelectOption label={t("filters.statusAll")} />
              </SelectItem>
              {REFUND_STATUSES.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className={MUTED_ITEM_CLASS}
                >
                  <SelectOption
                    label={
                      status === "pending"
                        ? t("table.statusPending")
                        : t("table.statusCompleted")
                    }
                  />
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="px-1 text-xs font-semibold text-brand-black">
          {t("filters.refundMethod")}
        </span>
        <Select
          value={value.refundMethod}
          onValueChange={(refundMethod) =>
            onChange({
              ...value,
              refundMethod:
                refundMethod as RefundOrdersFilterValues["refundMethod"],
            })
          }
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-48">
            <SelectValue placeholder={t("filters.refundMethod")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[14rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex flex-col gap-2">
              <SelectItem value="all" className={MUTED_ITEM_CLASS}>
                <SelectOption label={t("filters.methodAll")} />
              </SelectItem>
              {REFUND_METHODS.map((method) => (
                <SelectItem
                  key={method}
                  value={method}
                  className={MUTED_ITEM_CLASS}
                >
                  <SelectOption
                    label={
                      method === "bank_transfer"
                        ? t("table.methodBankTransfer")
                        : method === "wallet"
                          ? t("table.methodWallet")
                          : t("table.methodCash")
                    }
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
