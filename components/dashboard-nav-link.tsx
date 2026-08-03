"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import CustomIcon from "./custom-svg";

export type NavBadge = {
  count?: number;
  tone: "accent" | "orange" | "purple";
  isLoading?: boolean;
};

type DashboardNavLinkProps = {
  href?: string;
  label: string;
  icon: string;
  isActive: boolean;
  badge?: NavBadge;
  onClick?: () => void;
};

const badgeToneClass: Record<NavBadge["tone"], string> = {
  accent: "bg-brand-accent",
  orange: "bg-[#E8913A]",
  purple: "bg-brand-purple-dark",
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
            {badge.isLoading ? (
              <span className="size-2.5 animate-spin rounded-full border-2 border-brand-white border-t-transparent" />
            ) : (
              String(badge.count ?? 0).padStart(2, "0")
            )}
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
  onClick,
}: DashboardNavLinkProps) {
  const { setOpenMobile } = useSidebar();

  const handleClick = () => {
    setOpenMobile(false);
    onClick?.();
  };

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
            onClick={handleClick}
            className="flex w-full items-center justify-between gap-3 cursor-pointer"
          >
            <NavItemContent label={label} icon={icon} badge={badge} />
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          type="button"
          isActive={isActive}
          onClick={handleClick}
          className={cn(
            buttonClassName(isActive),
            "flex w-full items-center justify-between gap-3 cursor-pointer",
          )}
        >
          <NavItemContent label={label} icon={icon} badge={badge} />
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}
