import {
  employeeHasRole,
  getAccessProfile,
  getRestrictedProfileConfig,
  isOperationsPathname,
  isRestrictedOrderDetailStatus,
  isRestrictedOrderStatus,
  isRestrictedProfileAllowedPathname,
  type AccessProfile,
  type RestrictedAccessProfile,
} from "@/features/auth/lib/roles";
import type { RoleName } from "@/features/auth/types";
import type { HomeIndicatorKey } from "@/features/home/types";
import type { OrderStatus } from "@/features/orders/types";
import type { Employee } from "@/features/profile/types";

type Actor = Pick<Employee, "roles"> | null | undefined;

const ALL_HOME_INDICATOR_KEYS = [
  "processing",
  "verification",
  "payment",
  "completed",
  "cancelled",
  "refund",
] as const satisfies readonly HomeIndicatorKey[];

function isRestrictedProfile(
  profile: AccessProfile,
): profile is RestrictedAccessProfile {
  return profile !== "full" && profile !== "default";
}

/**
 * UI/server permission checks for the current actor.
 *
 * @example
 * const permissions = can(profile);
 * if (permissions.viewEmployees()) { ... }
 * permissions.homeIndicators(HOME_INDICATOR_META)
 */
export function can(actor: Actor) {
  const profile = getAccessProfile(actor);
  const fullAccess = profile === "full";
  const restricted = isRestrictedProfile(profile) ? profile : null;
  const restrictedConfig = restricted
    ? getRestrictedProfileConfig(restricted)
    : null;

  return {
    /** Admin / super-admin with unrestricted dashboard access. */
    isFullAccess(): boolean {
      return fullAccess;
    },

    /** Contract officer without a full-access role. */
    isContractOfficer(): boolean {
      return profile === "contract-officer";
    },

    /** Review officer without a full-access role. */
    isReviewOfficer(): boolean {
      return profile === "review-officer";
    },

    /** Data-entry officer without a full-access role. */
    isDataEntry(): boolean {
      return profile === "data-entry";
    },

    accessProfile(): AccessProfile {
      return profile;
    },

    hasRole(roleName: RoleName): boolean {
      return employeeHasRole(actor, roleName);
    },

    /** Home employees cards + Operations module. */
    viewEmployees(): boolean {
      return fullAccess;
    },

    viewOperations(): boolean {
      return fullAccess;
    },

    /** Entire home indicators block (section + cards). */
    viewIndicatorsSection(): boolean {
      if (fullAccess || !restricted) {
        return true;
      }

      return restrictedConfig!.indicatorKeys.length > 0;
    },

    viewHomeIndicator(key: HomeIndicatorKey): boolean {
      if (fullAccess || !restricted) {
        return true;
      }

      return (
        restrictedConfig!.indicatorKeys as readonly HomeIndicatorKey[]
      ).includes(key);
    },

    /** Filter home indicator cards down to what this actor may see. */
    homeIndicators<T extends { key: HomeIndicatorKey }>(
      indicators: readonly T[],
    ): T[] {
      if (fullAccess || !restricted) {
        return [...indicators];
      }

      const allowed = new Set<HomeIndicatorKey>(
        restrictedConfig!.indicatorKeys as readonly HomeIndicatorKey[],
      );

      return indicators.filter((indicator) => allowed.has(indicator.key));
    },

    homeIndicatorKeys(): readonly HomeIndicatorKey[] {
      if (fullAccess || !restricted) {
        return ALL_HOME_INDICATOR_KEYS;
      }

      return restrictedConfig!.indicatorKeys;
    },

    filterOrderStatus(status: string | null | undefined): boolean {
      if (!status || status === "all") {
        return !restricted;
      }

      if (fullAccess || !restricted) {
        return true;
      }

      return isRestrictedOrderStatus(restricted, status);
    },

    /** Status options shown in home (and similar) filter dropdowns. */
    orderStatuses<T extends { value: string }>(statuses: readonly T[]): T[] {
      if (fullAccess || !restricted) {
        return statuses.filter((status) => status.value !== "under_review");
      }

      return statuses.filter((status) =>
        isRestrictedOrderStatus(restricted, status.value),
      );
    },

    /**
     * Resolve the status sent to the list API.
     * Restricted roles always query an allowed status (first configured default).
     */
    resolveOrderStatusFilter(
      status: string | null | undefined,
    ): OrderStatus | undefined {
      if (restricted && restrictedConfig) {
        return isRestrictedOrderStatus(restricted, status)
          ? (status as OrderStatus)
          : restrictedConfig.orderStatuses[0];
      }

      if (!status || status === "all") {
        return undefined;
      }

      return status as OrderStatus;
    },

    /**
     * Select value for the home status filter.
     * Restricted roles never use "all".
     */
    orderStatusSelectValue(status: string | null | undefined): string {
      if (restricted && restrictedConfig) {
        return isRestrictedOrderStatus(restricted, status)
          ? (status as string)
          : restrictedConfig.orderStatuses[0];
      }

      return status ?? "all";
    },

    includeOrderStatusAllOption(): boolean {
      return !restricted;
    },

    viewPlatformNav(href: string | undefined): boolean {
      if (!href) {
        return true;
      }

      if (fullAccess || !restricted || !restrictedConfig) {
        return true;
      }

      return restrictedConfig.platformHrefs.includes(href);
    },

    /**
     * Whether this actor may open `/orders/[id]` for an order in the given status.
     * Restricted roles are limited to their defined statuses.
     */
    viewOrderDetail(status: string | null | undefined): boolean {
      if (fullAccess || !restricted) {
        return true;
      }

      return isRestrictedOrderDetailStatus(restricted, status);
    },

    accessPath(pathnameWithoutLocale: string): boolean {
      if (isOperationsPathname(pathnameWithoutLocale)) {
        return fullAccess;
      }

      if (restricted) {
        return isRestrictedProfileAllowedPathname(
          restricted,
          pathnameWithoutLocale,
        );
      }

      return true;
    },
  };
}

export type Can = ReturnType<typeof can>;
