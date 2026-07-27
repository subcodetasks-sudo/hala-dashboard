"use client";

import type { ControllerRenderProps } from "react-hook-form";

import SaudiPhoneField from "@/components/saudi-phone-field";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type ReviewFormPhoneFieldProps = {
  id: string;
  label: string;
  readOnly: boolean;
  error?: { message?: string };
  placeholder?: string;
  className?: string;
  field: Pick<
    ControllerRenderProps<any>,
    "value" | "onChange" | "onBlur"
  >;
};

export default function ReviewFormPhoneField({
  id,
  label,
  readOnly,
  error,
  placeholder,
  className,
  field,
}: ReviewFormPhoneFieldProps) {
  return (
    <Field className={className} data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <SaudiPhoneField
        id={id}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(readOnly && "bg-brand-background/40")}
      />
      <FieldError errors={[error]} />
    </Field>
  );
}
