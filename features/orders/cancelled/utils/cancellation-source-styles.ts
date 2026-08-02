import type { CancellationSourceValue } from "@/features/orders/types";

export type CancellationSourceStyle = {
  /** Shared surface + text colors for badge and select items. */
  surfaceClassName: string;
  itemClassName: string;
  iconClassName: string;
  iconSrc: string;
  labelKey:
    | "byCustomer"
    | "byReviewEmployee"
    | "byContractsEmployee"
    | "byAdmin";
};

export const CANCELLATION_SOURCE_STYLES: Record<
  CancellationSourceValue,
  CancellationSourceStyle
> = {
  customer: {
    surfaceClassName: "bg-[#8B6BB5]/15 text-[#8B6BB5]",
    itemClassName:
      "bg-[#8B6BB5]/15 text-[#8B6BB5] focus:bg-[#8B6BB5]/25 data-highlighted:bg-[#8B6BB5]/25 focus:text-[#8B6BB5] data-highlighted:text-[#8B6BB5]",
    iconClassName: "text-[#8B6BB5]",
    iconSrc: "/svg/user-square.svg",
    labelKey: "byCustomer",
  },
  review_employee: {
    surfaceClassName: "bg-brand-primary/15 text-brand-primary",
    itemClassName:
      "bg-brand-primary/15 text-brand-primary focus:bg-brand-primary/25 data-highlighted:bg-brand-primary/25 focus:text-brand-primary data-highlighted:text-brand-primary",
    iconClassName: "text-brand-primary",
    iconSrc: "/svg/user-octagon.svg",
    labelKey: "byReviewEmployee",
  },
  contracts_employee: {
    surfaceClassName: "bg-brand-warning/15 text-brand-warning",
    itemClassName:
      "bg-brand-warning/15 text-brand-warning focus:bg-brand-warning/25 data-highlighted:bg-brand-warning/25 focus:text-brand-warning data-highlighted:text-brand-warning",
    iconClassName: "text-brand-warning",
    iconSrc: "/svg/profile-circle.svg",
    labelKey: "byContractsEmployee",
  },
  admin: {
    surfaceClassName: "bg-brand-success-light text-brand-success",
    itemClassName:
      "bg-brand-success-light text-brand-success focus:bg-[#C8F5DC] data-highlighted:bg-[#C8F5DC] focus:text-brand-success data-highlighted:text-brand-success",
    iconClassName: "text-brand-success",
    iconSrc: "/svg/user-tick.svg",
    labelKey: "byAdmin",
  },
};

export const FALLBACK_CANCELLATION_SOURCE_STYLE: CancellationSourceStyle = {
  surfaceClassName: "bg-[#F5F5F5] text-brand-gris",
  itemClassName:
    "bg-[#F5F5F5] text-brand-gris focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB] focus:text-brand-gris data-highlighted:text-brand-gris",
  iconClassName: "text-brand-gris",
  iconSrc: "/svg/profile-2user.svg",
  labelKey: "byCustomer",
};

const SOURCE_ALIASES: Record<string, CancellationSourceValue> = {
  customer: "customer",
  client: "customer",
  review_employee: "review_employee",
  review_officer: "review_employee",
  reviewer: "review_employee",
  review: "review_employee",
  contracts_employee: "contracts_employee",
  contract_employee: "contracts_employee",
  contracts: "contracts_employee",
  admin: "admin",
  management: "admin",
};

export function resolveCancellationSourceValue(
  source: string | null | undefined,
): CancellationSourceValue | null {
  if (!source) return null;
  return SOURCE_ALIASES[source.trim().toLowerCase()] ?? null;
}

export function getCancellationSourceStyle(
  source: string | null | undefined,
): CancellationSourceStyle {
  const resolved = resolveCancellationSourceValue(source);
  return resolved
    ? CANCELLATION_SOURCE_STYLES[resolved]
    : FALLBACK_CANCELLATION_SOURCE_STYLE;
}
