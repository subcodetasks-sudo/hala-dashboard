import type { RoleName } from "@/features/auth/types";
import type { HomeIndicatorKey } from "@/features/home/types";
import type { OrderStatus } from "@/features/orders/types";
import type { Employee } from "@/features/profile/types";

/** Roles that currently have full dashboard access (including Operations). */
export const FULL_ACCESS_ROLE_NAMES = [
  "admin",
  "super-admin",
] as const satisfies readonly RoleName[];

export const SUPER_ADMIN_ROLE_NAME = "super-admin" as const satisfies RoleName;

export const CONTRACT_OFFICER_ROLE_NAME =
  "contract-officer" as const satisfies RoleName;

export const REVIEW_OFFICER_ROLE_NAME =
  "review-officer" as const satisfies RoleName;

export const DATA_ENTRY_ROLE_NAME = "data-entry" as const satisfies RoleName;

/** Pathnames under the dashboard that only full-access roles may open. */
export const OPERATIONS_PATHNAMES = [
  "/invoices",
  "/tracking",
  "/employees",
  "/permissions",
  "/content-management",
] as const;

/** Home indicator cards visible to contract officers. */
export const CONTRACT_OFFICER_INDICATOR_KEYS = [
  "processing",
  "verification",
] as const satisfies readonly HomeIndicatorKey[];

/** Review officers do not see any home indicator cards. */
export const REVIEW_OFFICER_INDICATOR_KEYS = [] as const satisfies readonly HomeIndicatorKey[];

/** Data-entry officers do not see any home indicator cards. */
export const DATA_ENTRY_INDICATOR_KEYS = [] as const satisfies readonly HomeIndicatorKey[];

/** Home status-filter values tied to contract-officer cards. */
export const CONTRACT_OFFICER_ORDER_STATUSES = [
  "processed",
  "sent_for_authentication",
] as const satisfies readonly OrderStatus[];

/** Home status-filter values for review officers. */
export const REVIEW_OFFICER_ORDER_STATUSES = [
  "new",
  "under_review",
] as const satisfies readonly OrderStatus[];

/** Home status-filter values for data-entry officers. */
export const DATA_ENTRY_ORDER_STATUSES = [
  "held",
] as const satisfies readonly OrderStatus[];

/**
 * Order detail statuses review officers may open.
 * Includes `under_review` so start-review can continue on the detail page.
 */
export const REVIEW_OFFICER_ORDER_DETAIL_STATUSES = [
  "new",
  "under_review",
] as const satisfies readonly OrderStatus[];

/** Platform sidebar links a contract officer may see. */
export const CONTRACT_OFFICER_PLATFORM_HREFS = [
  "/orders/processed",
  "/orders/verification",
] as const;

/** Platform sidebar links a review officer may see. */
export const REVIEW_OFFICER_PLATFORM_HREFS = ["/orders/new"] as const;

/** Platform sidebar links a data-entry officer may see. */
export const DATA_ENTRY_PLATFORM_HREFS = [
  "/orders/pending",
  "/orders/manual",
] as const;

/** All known order list routes (detail routes are everything else under /orders/). */
export const ORDER_LIST_PATHNAMES = [
  "/orders/manual",
  "/orders/new",
  "/orders/pending",
  "/orders/processed",
  "/orders/verification",
  "/orders/payment",
  "/orders/completed",
  "/orders/cancelled",
  "/orders/refunds",
] as const;

export type RestrictedAccessProfile =
  | "contract-officer"
  | "review-officer"
  | "data-entry";

export type AccessProfile = "full" | RestrictedAccessProfile | "default";

type RestrictedProfileConfig = {
  roleName: RoleName;
  indicatorKeys: readonly HomeIndicatorKey[];
  orderStatuses: readonly OrderStatus[];
  /** Statuses allowed on `/orders/[id]`. Defaults to `orderStatuses` when omitted. */
  orderDetailStatuses?: readonly OrderStatus[];
  platformHrefs: readonly string[];
};

const RESTRICTED_PROFILE_CONFIG: Record<
  RestrictedAccessProfile,
  RestrictedProfileConfig
> = {
  "review-officer": {
    roleName: REVIEW_OFFICER_ROLE_NAME,
    indicatorKeys: REVIEW_OFFICER_INDICATOR_KEYS,
    orderStatuses: REVIEW_OFFICER_ORDER_STATUSES,
    orderDetailStatuses: REVIEW_OFFICER_ORDER_DETAIL_STATUSES,
    platformHrefs: REVIEW_OFFICER_PLATFORM_HREFS,
  },
  "contract-officer": {
    roleName: CONTRACT_OFFICER_ROLE_NAME,
    indicatorKeys: CONTRACT_OFFICER_INDICATOR_KEYS,
    orderStatuses: CONTRACT_OFFICER_ORDER_STATUSES,
    platformHrefs: CONTRACT_OFFICER_PLATFORM_HREFS,
  },
  "data-entry": {
    roleName: DATA_ENTRY_ROLE_NAME,
    indicatorKeys: DATA_ENTRY_INDICATOR_KEYS,
    orderStatuses: DATA_ENTRY_ORDER_STATUSES,
    platformHrefs: DATA_ENTRY_PLATFORM_HREFS,
  },
};

/** Check order: first match wins when a user somehow has multiple restricted roles. */
const RESTRICTED_PROFILE_ORDER = [
  "review-officer",
  "contract-officer",
  "data-entry",
] as const satisfies readonly RestrictedAccessProfile[];

function normalizeRoleName(value: string) {
  return value.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

const fullAccessRoleSet = new Set<string>(
  FULL_ACCESS_ROLE_NAMES.map(normalizeRoleName),
);

function employeeRoleNames(
  employee: Pick<Employee, "roles"> | null | undefined,
): string[] {
  return (employee?.roles ?? [])
    .map((role) => role.name)
    .filter((name): name is string => Boolean(name))
    .map(normalizeRoleName);
}

export function hasFullDashboardAccess(
  roles: ReadonlyArray<{ name?: string | null }> | null | undefined,
): boolean {
  return (roles ?? []).some(
    (role) =>
      Boolean(role.name) &&
      fullAccessRoleSet.has(normalizeRoleName(role.name ?? "")),
  );
}

export function employeeHasFullDashboardAccess(
  employee: Pick<Employee, "roles"> | null | undefined,
): boolean {
  return hasFullDashboardAccess(employee?.roles);
}

export function employeeIsSuperAdmin(
  employee: Pick<Employee, "roles"> | null | undefined,
): boolean {
  return employeeHasRole(employee, SUPER_ADMIN_ROLE_NAME);
}

export function employeeHasRole(
  employee: Pick<Employee, "roles"> | null | undefined,
  roleName: RoleName,
): boolean {
  const normalized = normalizeRoleName(roleName);
  return employeeRoleNames(employee).includes(normalized);
}

export function getAccessProfile(
  employee: Pick<Employee, "roles"> | null | undefined,
): AccessProfile {
  if (employeeHasFullDashboardAccess(employee)) {
    return "full";
  }

  const roleNames = new Set(employeeRoleNames(employee));

  for (const profile of RESTRICTED_PROFILE_ORDER) {
    const config = RESTRICTED_PROFILE_CONFIG[profile];
    if (roleNames.has(normalizeRoleName(config.roleName))) {
      return profile;
    }
  }

  return "default";
}

export function getRestrictedProfileConfig(
  profile: RestrictedAccessProfile,
): RestrictedProfileConfig {
  return RESTRICTED_PROFILE_CONFIG[profile];
}

/**
 * Contract-officer access applies when the user has that role and does not
 * also have a full-access role (admin / super-admin wins).
 */
export function employeeIsContractOfficer(
  employee: Pick<Employee, "roles"> | null | undefined,
): boolean {
  return getAccessProfile(employee) === "contract-officer";
}

export function employeeIsReviewOfficer(
  employee: Pick<Employee, "roles"> | null | undefined,
): boolean {
  return getAccessProfile(employee) === "review-officer";
}

export function employeeIsDataEntry(
  employee: Pick<Employee, "roles"> | null | undefined,
): boolean {
  return getAccessProfile(employee) === "data-entry";
}

export function isOperationsPathname(pathnameWithoutLocale: string): boolean {
  return OPERATIONS_PATHNAMES.some(
    (path) =>
      pathnameWithoutLocale === path ||
      pathnameWithoutLocale.startsWith(`${path}/`),
  );
}

function isOrderDetailPathname(pathnameWithoutLocale: string): boolean {
  if (!pathnameWithoutLocale.startsWith("/orders/")) {
    return false;
  }

  const segment = pathnameWithoutLocale.slice("/orders/".length).split("/")[0];
  if (!segment) {
    return false;
  }

  return !(ORDER_LIST_PATHNAMES as readonly string[]).some(
    (path) => path === `/orders/${segment}`,
  );
}

export function isRestrictedProfileAllowedPathname(
  profile: RestrictedAccessProfile,
  pathnameWithoutLocale: string,
): boolean {
  const { platformHrefs } = RESTRICTED_PROFILE_CONFIG[profile];
  const allowedExact = new Set<string>([
    "/",
    "/account",
    "/notifications",
    ...platformHrefs,
  ]);

  if (allowedExact.has(pathnameWithoutLocale)) {
    return true;
  }

  if (
    platformHrefs.some((path) => pathnameWithoutLocale.startsWith(`${path}/`))
  ) {
    return true;
  }

  if (
    pathnameWithoutLocale === "/account" ||
    pathnameWithoutLocale.startsWith("/account/")
  ) {
    return true;
  }

  if (
    pathnameWithoutLocale === "/notifications" ||
    pathnameWithoutLocale.startsWith("/notifications/")
  ) {
    return true;
  }

  return isOrderDetailPathname(pathnameWithoutLocale);
}

/** @deprecated Prefer isRestrictedProfileAllowedPathname("contract-officer", ...) */
export function isContractOfficerAllowedPathname(
  pathnameWithoutLocale: string,
): boolean {
  return isRestrictedProfileAllowedPathname(
    "contract-officer",
    pathnameWithoutLocale,
  );
}

export function isRestrictedOrderStatus(
  profile: RestrictedAccessProfile,
  status: string | null | undefined,
): boolean {
  if (!status) {
    return false;
  }

  return (
    RESTRICTED_PROFILE_CONFIG[profile].orderStatuses as readonly string[]
  ).includes(status);
}

export function isRestrictedOrderDetailStatus(
  profile: RestrictedAccessProfile,
  status: string | null | undefined,
): boolean {
  if (!status) {
    return false;
  }

  const config = RESTRICTED_PROFILE_CONFIG[profile];
  const allowed = config.orderDetailStatuses ?? config.orderStatuses;
  return (allowed as readonly string[]).includes(status);
}

/** @deprecated Prefer isRestrictedOrderStatus("contract-officer", ...) */
export function isContractOfficerOrderStatus(
  status: string | null | undefined,
): status is (typeof CONTRACT_OFFICER_ORDER_STATUSES)[number] {
  return isRestrictedOrderStatus("contract-officer", status);
}

export function filterStatusesForContractOfficer<T extends { value: string }>(
  statuses: readonly T[],
): T[] {
  return statuses.filter((status) =>
    isRestrictedOrderStatus("contract-officer", status.value),
  );
}
