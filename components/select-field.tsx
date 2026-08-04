import CustomIcon from "@/components/custom-svg";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ReviewFormSelectOption =
  | string
  | {
      value: string;
      label: string;
    };

type ReviewFormSelectFieldProps = {
  id: string;
  label: string;
  iconSrc: string;
  value?: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  error?: { message?: string };
  options: readonly ReviewFormSelectOption[];
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  /** `filter` = filter control style (bg-[#F5F5F5]); `form` = form modal style (bg-white). */
  variant?: "filter" | "form";
};

function toSelectOption(option: ReviewFormSelectOption): {
  value: string;
  label: string;
} {
  if (typeof option === "string") {
    return { value: option, label: option };
  }
  return option;
}

export default function ReviewFormSelectField({
  id,
  label,
  iconSrc,
  value,
  onChange,
  readOnly,
  error,
  options,
  className,
  triggerClassName,
  placeholder,
  disabled = false,
  variant = "filter",
}: ReviewFormSelectFieldProps) {
  const normalizedOptions = options.map(toSelectOption);
  const isDisabled = readOnly || disabled;
  const isForm = variant === "form";

  return (
    <Field className={className} data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={id} className="px-1 text-xs font-semibold text-brand-black">
        {label}
      </FieldLabel>
      <Select value={value} onValueChange={onChange} disabled={isDisabled}>
        <SelectTrigger
          id={id}
          aria-invalid={!!error}
          className={cn(
            "h-11! w-full rounded-full px-3 text-sm font-semibold text-brand-black",
            isForm
              ? "border-brand-black/10 bg-brand-white"
              : "border-brand-black/5 bg-brand-gris-light hover:bg-brand-gris-light/80",
            readOnly && "bg-brand-background/40 opacity-100",
            triggerClassName
          )}
        >
          <span className="flex items-center gap-2">
            <CustomIcon src={iconSrc} size={16} className="text-brand-gris" />
            <SelectValue placeholder={placeholder} />
          </span>
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          avoidCollisions={false}
        >
          {normalizedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={[error]} />
    </Field>
  );
}
