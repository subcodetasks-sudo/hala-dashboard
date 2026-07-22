"use client";

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
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import DashboardNavLink, { type NavBadge } from "./dashboard-nav-link";

type NavLinkItem = {
  href?: string;
  labelKey: string;
  icon: string;
  badge?: NavBadge;
};

type NavGroupItem = {
  labelKey: string;
  icon: string;
  links: NavLinkItem[];
};

const navGroups: NavGroupItem[] = [
  {
    labelKey: "dashboard",
    icon: "/svg/home.svg",
    links: [
      {
        href: "/",
        labelKey: "home",
        icon: "/svg/home.svg",
      },
    ],
  },
  {
    labelKey: "platform",
    icon: "/svg/profile-2user.svg",
    links: [
      {
        href: "/orders/new",
        labelKey: "newOrders",
        icon: "/svg/receipt-2.svg",
        badge: { count: 2, tone: "accent" },
      },
      {
        href: "/orders/pending",
        labelKey: "pendingOrders",
        icon: "/svg/check.svg",
        badge: { count: 1, tone: "orange" },
      },
      {
        href: "/orders/processed",
        labelKey: "processedOrders",
        icon: "/svg/receipt-item.svg",
        badge: { count: 2, tone: "purple" },
      },
      {
        href: "/orders/verification",
        labelKey: "verificationOrders",
        icon: "/svg/refresh-2.svg",
      },
      {
        href: "/orders/payment",
        labelKey: "paymentOrders",
        icon: "/svg/dollar-circle.svg",
      },
      {
        href: "/orders/completed",
        labelKey: "completedOrders",
        icon: "/svg/shield-tick.svg",
      },
      {
        href: "/orders/cancelled",
        labelKey: "cancelledOrders",
        icon: "/svg/forbidden-2.svg",
      },
      {
        href: "/orders/refunds",
        labelKey: "refundOrders",
        icon: "/svg/refresh-2.svg",
      },
    ],
  },
  {
    labelKey: "operations",
    icon: "/svg/export.svg",
    links: [
      {
        href: "/invoices",
        labelKey: "invoices",
        icon: "/svg/receipt-2.svg",
      },
      {
        href: "/tracking",
        labelKey: "tracking",
        icon: "/svg/tag-2.svg",
      },
      {
        href: "/employees",
        labelKey: "employees",
        icon: "/svg/profile-2user.svg",
      },
      {
        href: "/permissions",
        labelKey: "permissions",
        icon: "/svg/profile-tick.svg",
      },
      {
        href: "/content-management",
        labelKey: "contentManagement",
        icon: "/svg/brush.svg",
      },
    ],
  },
  {
    labelKey: "account",
    icon: "/svg/person.svg",
    links: [
      {
        href: "/account",
        labelKey: "accountManagement",
        icon: "/svg/person.svg",
      },
      {
        labelKey: "logout",
        icon: "/svg/logout.svg",
      },
    ],
  },
];

export default function DashboardSidebar() {
  const t = useTranslations("Dashboard.Sidebar");
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <Sidebar
      side={locale === "ar" ? "right" : "left"}
      className="border-none bg-brand-background p-8 **:data-[slot=sidebar-inner]:bg-brand-background"
    >
      <SidebarHeader className="mb-2 px-2 py-3">
        <Image
          src="/logo.svg"
          alt={t("brand")}
          width={141}
          height={28}
          priority
          className="h-7 w-fit"
        />
      </SidebarHeader>

      <SidebarContent className="dashboard-sidebar-content gap-4 overflow-y-auto">
        {navGroups.map((group) => (
          <SidebarGroup key={group.labelKey} className="p-0">
            <SidebarGroupLabel className="mb-2 flex h-auto items-center gap-2 px-2 text-xs font-normal text-brand-gris">
              <span>{t(`groups.${group.labelKey}`)}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {group.links.map((link) => (
                  <DashboardNavLink
                    key={link.labelKey}
                    href={link.href}
                    label={t(`links.${link.labelKey}`)}
                    icon={link.icon}
                    badge={link.badge}
                    isActive={
                      !link.href
                        ? false
                        : link.href === "/"
                          ? pathname === "/"
                          : pathname === link.href ||
                            pathname.startsWith(`${link.href}/`)
                    }
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
