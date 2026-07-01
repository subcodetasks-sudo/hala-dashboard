"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

export default function DashboardNavProfile() {
  const t = useTranslations("Dashboard.Navbar");

  return (
    <div className="flex h-12 items-center gap-2.5 rounded-full bg-[#F5F5F5] py-0.5 ps-1 pe-3">
      <div className="relative size-10 shrink-0">
        <Avatar className="size-10 after:border-0">
          <AvatarFallback className="rounded-full bg-white text-sm font-semibold text-foreground">
            {t("userInitials")}
          </AvatarFallback>
        </Avatar>
        <span
          className="absolute top-0 left-0 size-2.5 rounded-full border-2 border-[#F5F5F5] bg-green-500"
          aria-hidden
        />
      </div>

      <div className="min-w-0 text-start leading-tight">
        <p className="truncate text-sm font-semibold text-foreground">
          {t("userName")}
        </p>
        <p className="text-xs text-muted-foreground">{t("userRole")}</p>
      </div>
    </div>
  );
}
