"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type DashboardNavLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
};

export default function DashboardNavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: DashboardNavLinkProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "h-11 rounded-full px-4 shadow-sm transition-colors",
          isActive
            ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white data-active:bg-blue-600 data-active:text-white"
            : "bg-white text-foreground hover:bg-white hover:text-foreground data-active:bg-white data-active:text-foreground",
        )}
      >
        <Link href={href} className="flex w-full items-center justify-between gap-3">
          <span>{label}</span>
          <Icon className="size-4 shrink-0" />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
