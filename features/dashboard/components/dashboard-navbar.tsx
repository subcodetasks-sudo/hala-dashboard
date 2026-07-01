"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import DashboardNavProfile from "@/features/dashboard/components/dashboard-nav-profile";
import { cn } from "@/lib/utils";
import { Bell, ChevronDown, MessageSquareText } from "lucide-react";
import { useTranslations } from "next-intl";



export default function DashboardNavbar() {
  const t = useTranslations("Dashboard.Navbar");
  const { toggleSidebar } = useSidebar();

    const iconButtonClass = "shrink-0 rounded-full p-0 size-12";
  return (
    <header className="mb-4 flex items-center justify-between gap-4">
      <Button
        type="button"
        aria-label={t("toggleMenu")}
        onClick={toggleSidebar}
        className={cn(iconButtonClass, "bg-blue-600 text-white hover:bg-blue-500")}
      >
        <span className="flex flex-col items-center justify-center gap-1">
          <span className="h-0.5 w-4 rounded-full bg-white" />
          <span className="h-0.5 w-4 rounded-full bg-white" />
        </span>
      </Button>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          aria-label={t("messages")}
          className={cn(
            iconButtonClass,
            "relative bg-[#f5f5f5] text-foreground hover:bg-[#E8E8E8]",
          )}
        >
          <MessageSquareText className="size-5" />
          <span className="absolute top-2 inset-e-2 size-2 rounded-full bg-red-500 ring-2 ring-[#f5f5f5]" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          aria-label={t("notifications")}
          className={cn(
            iconButtonClass,
            "relative bg-[#f5f5f5] text-foreground hover:bg-[#E8E8E8]",
          )}
        >
          <Bell className="size-5" />
          <span className="absolute top-2 inset-e-2 size-2 rounded-full bg-red-500 ring-2 ring-[#f5f5f5]" />
        </Button>

        <DashboardNavProfile />

        <Button
          type="button"
          aria-label={t("toggleDropdown")}
          className={cn(iconButtonClass, "bg-black text-white hover:bg-black/90")}
        >
          <ChevronDown className="size-5" />
        </Button>
      </div>
    </header>
  );
}
