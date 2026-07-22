"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Globe, Settings } from "lucide-react";
import DashboardNavProfile from "./dashboard-nav-profile";
import CustomIcon from "@/components/custom-svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import SearchBar from "./search-bar";

export default function DashboardNavbar() {
  const t = useTranslations("Dashboard.Navbar");
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const isHomePage = pathname === "/";

  const handleLocaleChange = (nextLocale: "ar" | "en") => {
    router.replace(pathname, { locale: nextLocale });
  };

  const iconButtonClass =
    "shrink-0 rounded-full p-0 size-12 bg-brand-background text-brand-primary hover:bg-brand-background/80 transition-colors";

  return (
    <header className="dashboard-navbar sticky top-0 z-30 -mx-4 -mt-4 mb-6 flex items-center justify-between gap-4 bg-background px-4 pt-4 pb-2">
      {/* Right Side (Search Bar on Home Page, Refresh Button on Other Pages) */}
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button for Mobile */}
        <Button
          type="button"
          aria-label={t("toggleMenu")}
          onClick={toggleSidebar}
          className={cn(iconButtonClass, "lg:hidden bg-brand-background hover:bg-brand-background/80")}
        >
          <span className="flex flex-col items-center justify-center gap-1.5">
            <span className="h-0.5 w-5 rounded-full bg-brand-primary" />
            <span className="h-0.5 w-5 rounded-full bg-brand-primary" />
            <span className="h-0.5 w-5 rounded-full bg-brand-primary" />
          </span>
        </Button>

        {isHomePage ? (
          <div className="flex items-center gap-3">
            {/* Main Search Input Pill */}
            <SearchBar />

            {/* Red Circle Search/Filter Button */}
            <Button
              type="button"
              className="size-12 rounded-full p-0 bg-brand-accent text-white hover:bg-brand-accent/90 shrink-0 flex items-center justify-center cursor-pointer border-none"
            >
              <CustomIcon src="/svg/search.svg" size={20} className="text-white" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 h-12 px-6 rounded-full border-none bg-brand-background text-brand-primary hover:bg-brand-background/80 transition-all font-semibold text-sm cursor-pointer"
          >
            <span>{t("refreshData")}</span>
            <CustomIcon src="/svg/refresh-2.svg" size={18} className="text-brand-primary shrink-0" />
          </Button>
        )}
      </div>

      {/* Left Side (Language, Settings, Notifications, Profile) */}
      <div className="flex items-center gap-2">
        {/* Language Selection */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1.5 h-12 px-3 text-brand-accent hover:text-brand-accent/80 hover:bg-transparent cursor-pointer"
            >
              <ChevronDown className="size-4" />
              <span className="text-sm font-semibold">
                {locale === "ar" ? "العربية" : "English"}
              </span>
              <Globe className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border border-border">
            <DropdownMenuItem onClick={() => handleLocaleChange("ar")} className="cursor-pointer">
              العربية
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLocaleChange("en")} className="cursor-pointer">
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings Button */}
        <Button
          type="button"
          aria-label="Settings"
          className={iconButtonClass}
        >
          <Settings className="size-5" />
        </Button>

        {/* Notifications Button */}
        <div className="relative">
          <Button
            type="button"
            aria-label={t("notifications")}
            className={iconButtonClass}
          >
            <CustomIcon src="/svg/notification.svg" size={20} className="text-brand-primary" />
          </Button>
          <span className="absolute -top-1.5 -start-1.5 flex size-5 items-center justify-center rounded-full bg-brand-accent text-[9px] font-bold text-white ring-2 ring-white">
            02
          </span>
        </div>

        {/* User Profile Badge */}
        <DashboardNavProfile />
      </div>
    </header>
  );
}
