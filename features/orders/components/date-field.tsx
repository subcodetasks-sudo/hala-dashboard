"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateFieldProps = {
  label: string;
  placeholder: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
};

export default function DateField({
  label,
  placeholder,
  value,
  onChange,
  className,
}: DateFieldProps) {
  const locale = useLocale();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="px-1 text-xs font-semibold text-brand-black">
        {label}
      </span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-11 w-full justify-between rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-normal hover:bg-[#F5F5F5]/80",
              !value && "text-brand-gris/60"
            )}
          >
            <span className="truncate">
              {value
                ? format(value, locale === "ar" ? "dd/MM/yyyy" : "MMM d, yyyy")
                : placeholder}
            </span>
            <CalendarIcon className="size-4 shrink-0 text-brand-gris" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
