"use client";

import { FileText } from "lucide-react";
import type { ReactNode } from "react";

import CustomIcon from "@/components/custom-svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderSource } from "@/features/home/types";
import { cn } from "@/lib/utils";

export type OrderTypeFilterValue = "all" | OrderSource;

type OrderTypeFilterProps = {
  value: OrderTypeFilterValue;
  onChange: (next: OrderTypeFilterValue) => void;
  label: string;
  allLabel: string;
  eformLabel: string;
  manualLabel: string;
  className?: string;
  triggerClassName?: string;
};

const ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-xl border-none px-4 py-2.5 font-bold text-brand-black outline-none focus:text-brand-black data-highlighted:text-brand-black [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full";

function TypeOption({
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

export default function OrderTypeFilter({
  value,
  onChange,
  label,
  allLabel,
  eformLabel,
  manualLabel,
  className,
  triggerClassName,
}: OrderTypeFilterProps) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5 sm:w-auto", className)}>
      <span className="px-1 text-xs font-semibold text-brand-black">{label}</span>
      <Select
        value={value}
        onValueChange={(next) => onChange(next as OrderTypeFilterValue)}
      >
        <SelectTrigger
          className={cn(
            "h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-40",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={label} />
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
                ITEM_CLASS,
                "bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]",
              )}
            >
              <TypeOption label={allLabel} />
            </SelectItem>
            <SelectItem
              value="eform"
              className={cn(
                ITEM_CLASS,
                "bg-[#FDEAF7] focus:bg-[#F9D6EE] data-highlighted:bg-[#F9D6EE]",
              )}
            >
              <TypeOption
                label={eformLabel}
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
                ITEM_CLASS,
                "bg-[#E8F9E8] focus:bg-[#D6F2D6] data-highlighted:bg-[#D6F2D6]",
              )}
            >
              <TypeOption
                label={manualLabel}
                icon={
                  <CustomIcon
                    src="/svg/hand.svg"
                    size={16}
                    className="shrink-0 text-brand-black"
                  />
                }
              />
            </SelectItem>
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
