"use client";

import DashboardNavLink from "@/features/dashboard/components/dashboard-nav-link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/navigation";
import { Box, Home, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DashboardSidebar() {
  const t = useTranslations("Dashboard.Sidebar");
  const pathname = usePathname();

  return (
    <Sidebar
      side="right"
      className="border-none bg-[#F5F5F5] **:data-[slot=sidebar-inner]:bg-[#F5F5F5] space-y-4 p-4"
    >
      <SidebarHeader >
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            <Shield className="size-5 text-[#1F9D8A]" strokeWidth={2.25} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold leading-tight text-foreground">
              {t("brand")}
            </span>
            <span className="text-xs text-muted-foreground">{t("subtitle")}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent >
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-normal text-muted-foreground">
            {t("groups.home")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <DashboardNavLink
                href="/"
                label={t("links.homeContent")}
                icon={Home}
                isActive={pathname === "/"}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>
    </Sidebar>
  );
}
