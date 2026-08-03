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
} & Omit<React.ComponentProps<typeof Input>, "id" | "readOnly" | "className">;

export default function ReviewFormTextField({
  id,
  label,
  iconSrc,
  readOnly,
  error,
  className,
  ...inputProps
}: ReviewFormTextFieldProps) {
  return (
    <Field className={className} data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
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
          className={cn(
            "h-11 rounded-full border-black/10 pe-3 ps-9",
            readOnly && "bg-brand-background/40"
          )}
          {...inputProps}
        />
      </div>
      <FieldError errors={[error]} />
    </Field>
  );
}
