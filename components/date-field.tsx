"use client";

import { format, parseISO } from "date-fns";
import { useLocale } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DEFAULT_DATE_ICON = "/svg/calendar.svg";

type DateFieldProps = {
  id?: string;
  label: string;
  placeholder?: string;
  value: Date | string | undefined;
  onChange: (value: Date | string | undefined) => void;
  /** Keep ISO string (`yyyy-MM-dd`) instead of `Date` when editing. */
  valueAs?: "date" | "iso";
  /** Dates before this day are not selectable. */
  minDate?: Date | string;
  /** Dates after this day are not selectable. */
  maxDate?: Date | string;
  readOnly?: boolean;
  error?: { message?: string };
  className?: string;
  buttonClassName?: string;
  iconSrc?: string;
  /** Shows a required marker next to the label. */
  required?: boolean;
  /** `filter` = orders filters style; `form` = review form input style. */
  variant?: "filter" | "form";
};

function toDate(value: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  return typeof value === "string" ? parseISO(value) : value;
}

export default function DateField({
  id,
  label,
  placeholder = "--/--/----",
  value,
  onChange,
  valueAs,
  minDate,
  maxDate,
  readOnly = false,
  error,
  className,
  buttonClassName,
  iconSrc,
  required = false,
  variant = "filter",
}: DateFieldProps) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const selectedDate = toDate(value);
  const min = toDate(minDate);
  const max = toDate(maxDate);
  const isForm = variant === "form";
  const emitIso =
    valueAs === "iso" || (valueAs !== "date" && typeof value === "string");

  const displayDate = selectedDate
    ? format(selectedDate, locale === "ar" ? "dd/MM/yyyy" : "MMM d, yyyy")
    : "";

  const disabledMatchers = [
    ...(min ? [{ before: min }] : []),
    ...(max ? [{ after: max }] : []),
  ];

  const handleSelect = (date: Date | undefined) => {
    if (emitIso) {
      onChange(date ? format(date, "yyyy-MM-dd") : "");
    } else {
      onChange(date);
    }
    setOpen(false);
  };

  return (
    <Field
      className={cn(isForm ? undefined : "flex flex-col gap-1.5", className)}
      data-invalid={!!error || undefined}
    >
      {label ? (
        <FieldLabel
          htmlFor={id}
          className={cn(
            "gap-1",
            !isForm && "px-1 text-xs font-semibold text-brand-black"
          )}
        >
          {label}
          {required ? (
            <span aria-hidden className="text-brand-accent">
              *
            </span>
          ) : null}
        </FieldLabel>
      ) : null}

      <Popover
        open={readOnly ? false : open}
        onOpenChange={readOnly ? undefined : setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-invalid={!!error}
            aria-readonly={readOnly || undefined}
            className={cn(
              isForm
                ? "relative h-11 w-full justify-start rounded-full border-brand-black/10 bg-brand-white pe-3 ps-9 text-sm font-normal text-brand-black hover:bg-brand-white"
                : "h-11 w-full justify-between rounded-full border-brand-black/5 bg-brand-gris-light px-4 text-sm font-normal text-brand-black hover:bg-brand-gris-light/80",
              isForm && readOnly && "bg-brand-background/40",
              !isForm &&
                readOnly &&
                "bg-brand-background/40 opacity-100 disabled:opacity-100",
              !selectedDate && "text-brand-gris/60",
              readOnly && "pointer-events-none",
              buttonClassName
            )}
          >
            {isForm ? (
              <CustomIcon
                src={iconSrc ?? DEFAULT_DATE_ICON}
                size={16}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-brand-gris"
              />
            ) : null}
            <span className="truncate">
              {selectedDate ? displayDate : placeholder}
            </span>
            {!isForm ? (
              <CustomIcon
                src={iconSrc ?? DEFAULT_DATE_ICON}
                size={16}
                className="shrink-0 text-brand-gris"
              />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={disabledMatchers.length ? disabledMatchers : undefined}
            defaultMonth={selectedDate ?? max ?? min}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {error ? <FieldError errors={[error]} /> : null}
    </Field>
  );
}
