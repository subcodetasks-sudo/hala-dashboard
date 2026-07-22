"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DashboardNavProfile() {
  const t = useTranslations("Dashboard.Navbar");

  return (
    <div className="flex h-12 items-center gap-2.5 rounded-full bg-brand-background py-0.5 ps-1 pe-3 transition-colors hover:bg-brand-background/80 cursor-pointer">
      <div className="relative size-10 shrink-0">
        <Avatar className="size-10 after:border-0">
          <AvatarImage
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
            alt={t("userName")}
          />
          <AvatarFallback className="rounded-full bg-white text-sm font-semibold text-foreground">
            {t("userInitials")}
          </AvatarFallback>
        </Avatar>
        <span
          className="absolute top-0 right-0 size-2.5 rounded-full border-2 border-brand-background bg-brand-success"
          aria-hidden
        />
      </div>

      <div className="min-w-0 text-start leading-tight">
        <p className="truncate text-sm font-semibold text-foreground">
          {t("userName")}
        </p>
        <p className="text-xs text-muted-foreground">{t("userRole")}</p>
      </div>

      <ChevronDown className="size-4 text-brand-accent shrink-0" />
    </div>
  );
}
