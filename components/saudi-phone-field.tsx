"use client";

import { GetCountries } from "react-country-state-city";
import { useEffect, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toSaudiPhoneLocal } from "@/features/orders/mock-data";
import { cn } from "@/lib/utils";

import "react-country-state-city/dist/react-country-state-city.css";

type Country = Awaited<ReturnType<typeof GetCountries>>[number];

type SaudiPhoneFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  "aria-invalid"?: boolean;
  className?: string;
};

export default function SaudiPhoneField({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  readOnly,
  placeholder = "5XXXXXXXX",
  "aria-invalid": ariaInvalid,
  className,
}: SaudiPhoneFieldProps) {
  const [saudi, setSaudi] = useState<Country | null>(null);

  useEffect(() => {
    let cancelled = false;

    void GetCountries().then((countries) => {
      if (cancelled) return;
      const sa = countries.find((country) => country.iso2 === "SA") ?? null;
      setSaudi(sa);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const phoneCode = saudi?.phone_code ? `+${saudi.phone_code}` : "+966";
  const flag = saudi?.emoji ?? "🇸🇦";

  return (
    <InputGroup
      dir="ltr"
      className={cn("h-11 rounded-full border-black/10 bg-white", className)}
      data-disabled={disabled || readOnly ? true : undefined}
    >
      <InputGroupAddon
        align="inline-start"
        className="gap-1.5 border-e border-black/10 pe-2.5 ps-3 text-brand-black"
        aria-hidden
      >
        <span
          className="stdropdown-flag text-base leading-none"
          aria-hidden
        >
          {flag}
        </span>
        <span className="text-sm font-semibold tabular-nums">{phoneCode}</span>
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={9}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        className="h-11 text-sm text-brand-black"
        onBlur={onBlur}
        onChange={(event) => {
          onChange(toSaudiPhoneLocal(event.target.value));
        }}
      />
    </InputGroup>
  );
}
