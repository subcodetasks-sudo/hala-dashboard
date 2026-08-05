"use client";

import { useMemo } from "react";

import CustomIcon from "@/components/custom-svg";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroupAddon } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

type ReviewFormComboboxOption =
  | string
  | {
      value: string;
      label: string;
    };

type ReviewFormComboboxFieldProps = {
  id: string;
  label: string;
  iconSrc: string;
  value?: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  error?: { message?: string };
  options: readonly ReviewFormComboboxOption[];
  className?: string;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  /** Shows a required marker next to the label. */
  required?: boolean;
  /** `filter` = filter control style; `form` = form modal style (bg-white). */
  variant?: "filter" | "form";
};

type NormalizedOption = {
  value: string;
  label: string;
};

function toComboboxOption(
  option: ReviewFormComboboxOption,
): NormalizedOption {
  if (typeof option === "string") {
    return { value: option, label: option };
  }
  return option;
}

export default function ReviewFormComboboxField({
  id,
  label,
  iconSrc,
  value,
  onChange,
  readOnly,
  error,
  options,
  className,
  placeholder,
  emptyMessage,
  disabled = false,
  required = false,
  variant = "filter",
}: ReviewFormComboboxFieldProps) {
  const items = useMemo(() => {
    const normalized = options.map(toComboboxOption);
    const selected = value?.trim();

    const result: NormalizedOption[] = [];
    const seenValues = new Set<string>();

    if (selected && selected !== "—") {
      result.push({ value: selected, label: selected });
      seenValues.add(selected);
    }

    for (const opt of normalized) {
      if (!seenValues.has(opt.value)) {
        seenValues.add(opt.value);
        result.push(opt);
      }
    }

    return result;
  }, [options, value]);

  const selectedItem = useMemo(() => {
    if (!value?.trim()) {
      return null;
    }
    return items.find((item) => item.value === value) ?? {
      value,
      label: value,
    };
  }, [items, value]);

  const isDisabled = readOnly || disabled;
  const isForm = variant === "form";

  return (
    <Field className={className} data-invalid={!!error || undefined}>
      <FieldLabel
        htmlFor={id}
        className="gap-1 px-1 text-xs font-semibold text-brand-black"
      >
        {label}
        {required ? (
          <span aria-hidden className="text-brand-accent">
            *
          </span>
        ) : null}
      </FieldLabel>
      <Combobox
        items={items}
        value={selectedItem}
        onValueChange={(next) => {
          onChange(next?.value ?? "");
        }}
        disabled={isDisabled}
        readOnly={readOnly}
        isItemEqualToValue={(a, b) => a.value === b.value}
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
      >
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          disabled={isDisabled}
          aria-invalid={!!error || undefined}
          className={cn(
            "h-11! w-full rounded-full border text-sm font-semibold text-brand-black",
            "[&_[data-slot=input-group-control]]:h-11 [&_[data-slot=input-group-control]]:rounded-full [&_[data-slot=input-group-control]]:border-0 [&_[data-slot=input-group-control]]:bg-transparent [&_[data-slot=input-group-control]]:px-1 [&_[data-slot=input-group-control]]:shadow-none [&_[data-slot=input-group-control]]:focus-visible:ring-0",
            isForm
              ? "border-brand-black/10 bg-brand-white"
              : "border-brand-black/5 bg-brand-gris-light",
            readOnly && "bg-brand-background/40 opacity-100",
            error && "border-destructive aria-invalid:ring-destructive/20",
          )}
        >
          <InputGroupAddon
            align="inline-start"
            className="pointer-events-none ps-3 text-brand-gris"
          >
            <CustomIcon src={iconSrc} size={16} />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent side="bottom" align="start" className="rounded-xl">
          <ComboboxEmpty>
            {emptyMessage ?? "No results found"}
          </ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError errors={[error]} />
    </Field>
  );
}
