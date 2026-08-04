"use client";

import { useTranslations } from "next-intl";
import type { ChangeEventHandler } from "react";

import CustomIcon from "./custom-svg";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const SearchBar = ({
  placeholder,
  className,
  value,
  onChange,
}: SearchBarProps) => {
  const t = useTranslations("Dashboard.Navbar");

  return (
    <div
      className={cn(
        "relative flex h-12 w-full sm:w-[300px] md:w-[380px] max-w-[400px] items-center rounded-full border border-brand-black/5 bg-brand-gris-light px-4 transition-all focus-within:border-brand-primary/20 focus-within:bg-brand-white focus-within:ring-2 focus-within:ring-brand-primary/20",
        className
      )}
    >
      <CustomIcon
        src="/svg/search.svg"
        size={20}
        className="shrink-0 text-brand-gris"
      />
      <span className="mx-3 h-5 w-px shrink-0 bg-brand-black/10" />
      <Input
        type="search"
        placeholder={placeholder ?? t("searchPlaceholder")}
        value={value}
        onChange={onChange}
        className="h-full w-full border-none bg-transparent p-0 text-sm text-brand-black outline-none placeholder:text-brand-gris/60 focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default SearchBar;
