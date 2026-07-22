"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import CustomIcon from "./custom-svg";

export type NavBadge = {
  count: number;
  tone: "accent" | "orange" | "purple";
};

type DashboardNavLinkProps = {
  href?: string;
  label: string;
  icon: string;
  isActive: boolean;
  badge?: NavBadge;
};

const badgeToneClass: Record<NavBadge["tone"], string> = {
  accent: "bg-brand-accent",
  orange: "bg-[#E8913A]",
  purple: "bg-[#8B6BB5]",
};

const buttonClassName = (isActive: boolean) =>
  cn(
    "h-11 rounded-full px-4 transition-colors font-medium",
    isActive
      ? "bg-brand-primary text-brand-white hover:bg-brand-primary hover:text-brand-white data-active:bg-brand-primary data-active:text-brand-white"
      : "bg-brand-white text-brand-black hover:bg-brand-white hover:text-brand-black data-active:bg-brand-white data-active:text-brand-black",
  );

function NavItemContent({
  label,
  icon,
  badge,
}: {
  label: string;
  icon: string;
  badge?: NavBadge;
}) {
  return (
    <>
      <span className="truncate text-sm">{label}</span>
      <span className="flex shrink-0 items-center gap-1.5" dir="ltr">
        <CustomIcon src={icon} size={20} className="text-current" />
        {badge ? (
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-[10px] font-semibold text-brand-white",
              badgeToneClass[badge.tone],
            )}
          >
            {String(badge.count).padStart(2, "0")}
          </span>
        ) : null}
      </span>
    </>
  );
}

export default function DashboardNavLink({
  href,
  label,
  icon,
  isActive,
  badge,
}: DashboardNavLinkProps) {
  return (
    <SidebarMenuItem>
      {href ? (
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={buttonClassName(isActive)}
        >
          <Link
            href={href}
            className="flex w-full items-center justify-between gap-3"
          >
            <NavItemContent label={label} icon={icon} badge={badge} />
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          type="button"
          isActive={isActive}
          className={cn(
            buttonClassName(isActive),
            "flex w-full items-center justify-between gap-3",
          )}
        >
          <NavItemContent label={label} icon={icon} badge={badge} />
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}
