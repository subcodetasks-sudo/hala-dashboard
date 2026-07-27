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

type ReviewFormSelectFieldProps = {
  id: string;
  label: string;
  iconSrc: string;
  value?: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  error?: { message?: string };
  options: readonly string[];
  className?: string;
  placeholder?: string;
};

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
  placeholder,
}: ReviewFormSelectFieldProps) {
  return (
    <Field className={className} data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={onChange} disabled={readOnly}>
        <SelectTrigger
          id={id}
          aria-invalid={!!error}
          className={cn(
            "h-11! w-full rounded-xl border-black/10 px-3",
            readOnly && "bg-brand-background/40 opacity-100"
          )}
        >
          <span className="flex items-center gap-2">
            <CustomIcon src={iconSrc} size={16} className="text-brand-gris" />
            <SelectValue placeholder={placeholder} />
          </span>
        </SelectTrigger>
        <SelectContent position="popper" side="bottom" align="start">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={[error]} />
    </Field>
  );
}
