"use client";

import {
  AlertTriangle,
  ArrowLeftRight,
  FileText,
  UserRound,
} from "lucide-react";
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
import { useHoldReasons } from "@/features/orders/pending/queries/use-hold-reasons";
import type {
  HoldReasonValue,
  PendingOrdersFilterValues,
} from "@/features/orders/types";
import { cn } from "@/lib/utils";

type PendingOrdersFiltersProps = {
  value: PendingOrdersFilterValues;
  onChange: (next: PendingOrdersFilterValues) => void;
  onApply: () => void;
};

const REASON_STYLE: Record<
  HoldReasonValue,
  { itemClassName: string; icon: ReactNode }
> = {
  missing_document: {
    itemClassName:
      "bg-[#F3EDF8] focus:bg-[#E8DCF2] data-highlighted:bg-[#E8DCF2]",
    icon: <FileText className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  worker_data_unclear: {
    itemClassName:
      "bg-[#FEF3E6] focus:bg-[#FDE5C8] data-highlighted:bg-[#FDE5C8]",
    icon: <UserRound className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  employer_data_incomplete: {
    itemClassName:
      "bg-[#FEF3E6] focus:bg-[#FDE5C8] data-highlighted:bg-[#FDE5C8]",
    icon: <UserRound className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  unclear_document: {
    itemClassName:
      "bg-[#FDECEC] focus:bg-[#F9D6D6] data-highlighted:bg-[#F9D6D6]",
    icon: <AlertTriangle className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  data_conflict: {
    itemClassName:
      "bg-brand-background focus:bg-brand-primary/15 data-highlighted:bg-brand-primary/15",
    icon: <ArrowLeftRight className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  other: {
    itemClassName:
      "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]",
    icon: <AlertTriangle className="size-4 shrink-0" strokeWidth={1.75} />,
  },
};

const FALLBACK_STYLE = {
  itemClassName:
    "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]",
  icon: <AlertTriangle className="size-4 shrink-0" strokeWidth={1.75} />,
};

const REASON_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold text-brand-black outline-none focus:text-brand-black data-highlighted:text-brand-black [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

function ReasonOption({
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

export default function PendingOrdersFilters({
  value,
  onChange,
  onApply,
}: PendingOrdersFiltersProps) {
  const t = useTranslations("Orders.Pending");
  const { data: holdReasons = [], isLoading } = useHoldReasons();

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

      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="px-1 text-xs font-semibold text-brand-black">
          {t("filters.suspensionType")}
        </span>
        <Select
          value={value.suspensionReason}
          onValueChange={(suspensionReason) =>
            onChange({
              ...value,
              suspensionReason:
                suspensionReason as PendingOrdersFilterValues["suspensionReason"],
            })
          }
          disabled={isLoading}
        >
          <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-48">
            <SelectValue placeholder={t("filters.suspensionType")} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="center"
            className="min-w-[14rem] no-scrollbar rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0"
          >
            <div className="flex max-h-64 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <SelectItem
                value="all"
                className={cn(
                  REASON_ITEM_CLASS,
                  "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]"
                )}
              >
                <ReasonOption label={t("filters.reasonAll")} />
              </SelectItem>
              {holdReasons.map((reason) => {
                const style =
                  REASON_STYLE[reason.value] ?? FALLBACK_STYLE;
                return (
                  <SelectItem
                    key={reason.value}
                    value={reason.value}
                    className={cn(REASON_ITEM_CLASS, style.itemClassName)}
                  >
                    <ReasonOption label={reason.label} icon={style.icon} />
                  </SelectItem>
                );
              })}
            </div>
          </SelectContent>
        </Select>
      </div>

      <ConfirmFilterButton label={t("filters.apply")} onClick={onApply} />
    </div>
  );
}
