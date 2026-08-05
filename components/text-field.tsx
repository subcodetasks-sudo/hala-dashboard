import CustomIcon from "@/components/custom-svg";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ReviewFormTextFieldProps = {
  id: string;
  label: string;
  iconSrc: string;
  readOnly: boolean;
  error?: { message?: string };
  className?: string;
  /** Overrides applied to the inner input (e.g. a taller `h-14`). */
  inputClassName?: string;
  /** Shows a required marker next to the label. */
  required?: boolean;
  /** Decorative element pinned to the inline-end side of the input. */
  endAdornment?: React.ReactNode;
} & Omit<
  React.ComponentProps<typeof Input>,
  "id" | "readOnly" | "className" | "required"
>;

export default function ReviewFormTextField({
  id,
  label,
  iconSrc,
  readOnly,
  error,
  className,
  inputClassName,
  required = false,
  endAdornment,
  ...inputProps
}: ReviewFormTextFieldProps) {
  return (
    <Field className={className} data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={id} className="gap-1">
        {label}
        {required ? (
          <span aria-hidden className="text-brand-accent">
            *
          </span>
        ) : null}
      </FieldLabel>
      <div className="relative">
        <CustomIcon
          src={iconSrc}
          size={16}
          className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-brand-gris"
        />
        <Input
          id={id}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-required={required || undefined}
          className={cn(
            "h-11 rounded-full border-black/10 ps-9",
            endAdornment ? "pe-10" : "pe-3",
            readOnly && "bg-brand-background/40",
            inputClassName
          )}
          {...inputProps}
        />
        {endAdornment ? (
          <span
            aria-hidden
            className="pointer-events-none absolute end-3 top-1/2 inline-flex -translate-y-1/2 items-center"
          >
            {endAdornment}
          </span>
        ) : null}
      </div>
      <FieldError errors={[error]} />
    </Field>
  );
}
