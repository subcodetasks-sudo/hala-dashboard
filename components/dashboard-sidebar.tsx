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
import { useCan } from "@/features/auth/lib/use-can";
import { useClearProfile } from "@/features/profile/queries/use-profile";
import { useRenewalRequestStats } from "@/features/orders/queries/use-renewal-request-stats";
import { useRenewalRequestHeldStats } from "@/features/orders/queries/use-renewal-request-held-stats";
import { useRenewalRequestProcessedStats } from "@/features/orders/queries/use-renewal-request-processed-stats";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";
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
        badge: { count: 0, tone: "accent" },
      },
      {
        href: "/orders/pending",
        labelKey: "pendingOrders",
        icon: "/svg/check.svg",
        badge: { count: 0, tone: "orange" },
      },
      {
        href: "/orders/processed",
        labelKey: "processedOrders",
        icon: "/svg/receipt-item.svg",
        badge: { count: 0, tone: "purple" },
      },
      {
        href: "/orders/verification",
        labelKey: "verificationOrders",
        icon: "/svg/export.svg",
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
  const tLogout = useTranslations("Auth.Logout");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const clearProfile = useClearProfile();
  const permissions = useCan();
  const { newRequestsCount, isLoading: isNewLoading } = useRenewalRequestStats();
  const { heldRequestsCount, isLoading: isHeldLoading } = useRenewalRequestHeldStats();
  const { processedRequestsCount, isLoading: isProcessedLoading } =
    useRenewalRequestProcessedStats();
  const isLoggingOut = useRef(false);
  const visibleNavGroups = navGroups
    .filter(
      (group) => group.labelKey !== "operations" || permissions.viewOperations(),
    )
    .map((group) => {
      if (group.labelKey !== "platform") {
        return group;
      }

      return {
        ...group,
        links: group.links.filter((link) =>
          permissions.viewPlatformNav(link.href),
        ),
      };
    })
    .filter((group) => group.links.length > 0);

  async function performLogout() {
    if (isLoggingOut.current) {
      return;
    }

    isLoggingOut.current = true;

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Language": locale,
        },
      });

      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !payload?.success) {
        toast.error(payload?.message || tLogout("errorToast"));
        return;
      }

      clearProfile();
      toast.success(payload.message || tLogout("route.success"));
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error(tLogout("errorToast"));
    } finally {
      isLoggingOut.current = false;
    }
  }

  function handleLogoutClick() {
    toast.warning(tLogout("confirmMessage"), {
      id: "logout-confirm",
      action: {
        label: tLogout("confirmAction"),
        onClick: () => {
          void performLogout();
        },
      },
    });
  }

  return (
    <Sidebar
      side={locale === "ar" ? "right" : "left"}
      className="border-none bg-brand-background p-0 **:data-[slot=sidebar-inner]:bg-brand-background **:data-[slot=sidebar-inner]:p-6"
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
        {visibleNavGroups.map((group) => (
          <SidebarGroup key={group.labelKey} className="p-0">
            <SidebarGroupLabel className="mb-2 flex h-auto items-center gap-2 px-2 text-xs font-normal text-brand-gris">
              <span>{t(`groups.${group.labelKey}`)}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {group.links.map((link) => {
                  let badge = link.badge;

                  if (link.labelKey === "newOrders") {
                    badge = {
                      count: newRequestsCount,
                      tone: "accent" as const,
                      isLoading: isNewLoading,
                    };
                  } else if (link.labelKey === "pendingOrders") {
                    badge = {
                      count: heldRequestsCount,
                      tone: "orange" as const,
                      isLoading: isHeldLoading,
                    };
                  } else if (link.labelKey === "processedOrders") {
                    badge = {
                      count: processedRequestsCount,
                      tone: "purple" as const,
                      isLoading: isProcessedLoading,
                    };
                  }

                  return (
                    <DashboardNavLink
                      key={link.labelKey}
                      href={link.href}
                      label={t(`links.${link.labelKey}`)}
                      icon={link.icon}
                      badge={badge}
                      onClick={
                        link.labelKey === "logout" ? handleLogoutClick : undefined
                      }
                      isActive={
                        !link.href
                          ? false
                          : link.href === "/"
                            ? pathname === "/"
                            : pathname === link.href ||
                              pathname.startsWith(`${link.href}/`)
                      }
                    />
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
