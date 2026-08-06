import type { PermissionRoleKey } from "@/features/permissions/types";

export const FALLBACK_ROLE_ICON = {
  iconSrc: "/svg/profile-tick.svg",
  iconBgClassName: "bg-brand-primary/15",
  iconClassName: "text-brand-primary",
} as const;

export const ROLE_ICON_CONFIG: Record<
  PermissionRoleKey,
  { iconSrc: string; iconBgClassName: string; iconClassName: string }
> = {
  systemAdmin: {
    iconSrc: "/svg/crown.svg",
    iconBgClassName: "bg-brand-purple/15",
    iconClassName: "text-brand-purple",
  },
  review: {
    iconSrc: "/svg/chart.svg",
    iconBgClassName: "bg-brand-primary/15",
    iconClassName: "text-brand-primary",
  },
  dataProcessing: {
    iconSrc: "/svg/mouse-circle.svg",
    iconBgClassName: "bg-brand-purple/15",
    iconClassName: "text-brand-purple",
  },
  contractFollowUp: {
    iconSrc: "/svg/document-upload.svg",
    iconBgClassName: "bg-brand-primary/15",
    iconClassName: "text-brand-primary",
  },
  contractApproval: {
    iconSrc: "/svg/clipboard-tick.svg",
    iconBgClassName: "bg-brand-success-light",
    iconClassName: "text-brand-success",
  },
  contractPayments: {
    iconSrc: "/svg/empty-wallet-tick.svg",
    iconBgClassName: "bg-brand-light-yellow",
    iconClassName: "text-brand-warning",
  },
};

export const FALLBACK_ROLE_BADGE_STYLE =
  "bg-brand-primary/10 text-brand-primary";

export const ROLE_BADGE_STYLES: Record<PermissionRoleKey, string> = {
  systemAdmin: "bg-brand-purple/15 text-brand-purple",
  review: "bg-brand-primary/10 text-brand-primary",
  dataProcessing: "bg-brand-purple/15 text-brand-purple",
  contractFollowUp: "bg-brand-primary/10 text-brand-primary",
  contractApproval: "bg-brand-success-light text-brand-success",
  contractPayments: "bg-brand-light-yellow text-brand-warning",
};

export function getRoleIconConfig(roleKey: PermissionRoleKey | null) {
  if (roleKey && ROLE_ICON_CONFIG[roleKey]) {
    return ROLE_ICON_CONFIG[roleKey];
  }
  return FALLBACK_ROLE_ICON;
}

export function getRoleBadgeStyle(roleKey: PermissionRoleKey | null): string {
  if (roleKey && ROLE_BADGE_STYLES[roleKey]) {
    return ROLE_BADGE_STYLES[roleKey];
  }
  return FALLBACK_ROLE_BADGE_STYLE;
}
