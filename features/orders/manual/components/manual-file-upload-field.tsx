"use client";

import { useId, useRef, type ChangeEvent } from "react";

import CustomIcon from "@/components/custom-svg";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const UPLOAD_ACCEPT = ".png,.pdf,image/png,application/pdf";

type ManualFileUploadFieldProps = {
  id?: string;
  label: string;
  uploadLabel: string;
  formatsLabel: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: { message?: string };
  required?: boolean;
  /** Optional node rendered next to the label (e.g. info tooltip). */
  labelAddon?: React.ReactNode;
  className?: string;
};

export default function ManualFileUploadField({
  id: idProp,
  label,
  uploadLabel,
  formatsLabel,
  value,
  onChange,
  error,
  required = false,
  labelAddon,
  className,
}: ManualFileUploadFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <Field className={className} data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={id} className="gap-1">
        <span className="inline-flex items-center gap-1.5">
          {label}
          {required ? (
            <span aria-hidden className="text-brand-accent">
              *
            </span>
          ) : null}
          {labelAddon}
        </span>
      </FieldLabel>

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={UPLOAD_ACCEPT}
        className="sr-only"
        aria-invalid={!!error || undefined}
        aria-required={required || undefined}
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex h-14 w-full items-center gap-3 rounded-full border border-black/10 bg-brand-gris/4 px-4 text-start transition-colors",
          "hover:border-brand-primary/30 hover:bg-brand-background/40",
          error && "border-destructive"
        )}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-brand-black">
            {value?.name ?? uploadLabel}
          </span>
          <span className="mt-0.5 block text-xs text-brand-gris">
            {formatsLabel}
          </span>
        </span>
        <CustomIcon
          src="/svg/download-cloud.svg"
          size={22}
          className="shrink-0 text-brand-gris"
        />
      </button>

      <FieldError errors={[error]} />
    </Field>
  );
}
