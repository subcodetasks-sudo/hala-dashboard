"use client";

import type { ComponentProps } from "react";

import ClearFilterButton from "@/components/clear-filter-button";
import ConfirmFilterButton from "@/components/confirm-filter-button";
import { cn } from "@/lib/utils";

type FilterActionButtonsProps = {
  applyLabel: string;
  onApply: () => void;
  onClear: () => void;
  className?: string;
  applyClassName?: ComponentProps<typeof ConfirmFilterButton>["className"];
};

export default function FilterActionButtons({
  applyLabel,
  onApply,
  onClear,
  className,
  applyClassName,
}: FilterActionButtonsProps) {
  return (
    <div className={cn("flex items-end gap-2", className)}>
      <ConfirmFilterButton
        label={applyLabel}
        onClick={onApply}
        className={applyClassName}
      />
      <ClearFilterButton onClick={onClear} />
    </div>
  );
}
