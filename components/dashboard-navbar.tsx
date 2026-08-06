"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardNavbar() {
  const t = useTranslations("Dashboard.Navbar");
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isHomePage = pathname === "/";

  const handleLocaleChange = (nextLocale: "ar" | "en") => {
    router.replace(pathname, { locale: nextLocale });
  };

  const iconButtonClass =
    "shrink-0 rounded-full p-0 size-12 bg-brand-background text-brand-primary hover:bg-brand-background/80 transition-colors";

  return (
    <TooltipProvider>
      <header className="dashboard-navbar sticky top-0 z-30 -mx-4 -mt-4 mb-6 flex flex-col bg-background px-4 pt-4 pb-2 border-b border-black/5">
        <div className="flex w-full items-center justify-between gap-4">
          {/* Right Side (Search Button/Bar on Home Page, Refresh Button on Other Pages) */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
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
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Inline Search Bar on Large Screens */}
                <SearchBar className="hidden lg:flex flex-1 min-w-0" />

                {/* Search Toggle Button for Mobile / Action Button for Desktop */}
                <Button
                  type="button"
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                  className={cn(
                    "size-12 rounded-full p-0 shrink-0 flex items-center justify-center cursor-pointer border-none transition-colors lg:bg-brand-accent lg:hover:bg-brand-accent/90",
                    isSearchOpen ? "bg-brand-primary text-white" : "bg-brand-accent text-white hover:bg-brand-accent/90"
                  )}
                >
                  <CustomIcon src="/svg/search.svg" size={20} className="text-white" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => window.location.reload()}
                aria-label={t("refreshData")}
                className="flex size-12 shrink-0 items-center justify-center gap-2 rounded-2xl border-none bg-brand-background p-0 text-brand-gris transition-all hover:bg-brand-background/80 cursor-pointer sm:h-12 sm:w-auto sm:px-6 shadow-lg"
              >
                <CustomIcon
                  src="/svg/refresh.svg"
                  size={18}
                  className="shrink-0"
                />
                <span className="hidden font-semibold text-sm sm:inline">
                  {t("refreshData")}
                </span>
              </Button>
            )}
          </div>

          {/* Left Side (Language selection, Settings, Notifications, Profile) */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            {/* Language Selection: Large Screens Only */}
            <div className="hidden lg:block">
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
            </div>

            {/* Settings Button with Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  aria-label={t("settings")}
                  onClick={() => router.push("/settings")}
                  className={iconButtonClass}
                >
                  <Settings className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("settings")}</p>
              </TooltipContent>
            </Tooltip>

            {/* Notifications Button with Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("notifications")}</p>
              </TooltipContent>
            </Tooltip>

            {/* User Profile Badge */}
            <DashboardNavProfile />
          </div>
        </div>

        {/* Search Popup overlay below navbar (hidden on large screens) */}
        {isHomePage && isSearchOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 z-40 mt-1 px-4 py-3 bg-white border-b border-border shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 max-w-xl mx-auto">
              <SearchBar className="flex-1" />
              <Button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="h-12 px-4 rounded-full border-none bg-brand-background text-brand-primary hover:bg-brand-background/80 transition-all font-semibold text-sm cursor-pointer shrink-0"
              >
                {locale === "ar" ? "إغلاق" : "Close"}
              </Button>
            </div>
          </div>
        )}
      </header>
    </TooltipProvider>
  );
}
