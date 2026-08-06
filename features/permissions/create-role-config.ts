import type { ApiPermission, ApiPermissionGroup } from "@/features/permissions/types";

const DEFAULT_MODULE_ICON = "/svg/shield-tick.svg";

/** Icon for each backend permission module. */
const MODULE_ICONS: Record<string, string> = {
  blog: "/svg/document-text.svg",
  cancel_statuses: "/svg/forbidden-2.svg",
  cities: "/svg/location.svg",
  contracts: "/svg/document-upload.svg",
  dashboard: "/svg/chart.svg",
  home: "/svg/home.svg",
  invoices: "/svg/receipt-item.svg",
  legal: "/svg/document-text.svg",
  passport_places: "/svg/personalcard.svg",
  payments: "/svg/empty-wallet-tick.svg",
  permissions: "/svg/shield-tick.svg",
  refunds: "/svg/money-recive.svg",
  requests: "/svg/clipboard.svg",
  "requests.authentication_sent": "/svg/document-upload.svg",
  "requests.awaiting_payment": "/svg/empty-wallet-tick.svg",
  "requests.cancelled": "/svg/receipt-minus.svg",
  "requests.completed": "/svg/tick-square.svg",
  "requests.held": "/svg/timer.svg",
  "requests.new": "/svg/clipboard-tick.svg",
  "requests.processed": "/svg/receipt-item.svg",
  "requests.refunds": "/svg/money-recive.svg",
  roles: "/svg/profile-tick.svg",
  settings: "/svg/edit.svg",
  tracking: "/svg/routing-2.svg",
  users: "/svg/profile-2user.svg",
};

/**
 * Action segment from a permission name (`blog.create` → `create`,
 * `requests.new.view` → `view`).
 */
export function permissionActionKey(permissionName: string): string {
  const segments = permissionName.split(".");
  return segments[segments.length - 1] || permissionName;
}

export function getPermissionModuleIcon(module: string): string {
  return MODULE_ICONS[module] ?? DEFAULT_MODULE_ICON;
}

export function collectPermissionIds(
  groups: ApiPermissionGroup[],
): number[] {
  return groups.flatMap((group) =>
    group.permissions.map((permission) => permission.id),
  );
}

export function mapSelectedPermissionNames(
  groups: ApiPermissionGroup[],
  selectedIds: ReadonlySet<number>,
): string[] {
  const names: string[] = [];
  for (const group of groups) {
    for (const perm of group.permissions) {
      if (selectedIds.has(perm.id)) {
        names.push(perm.name);
      }
    }
  }
  return names;
}

export function areAllPermissionIdsSelected(
  groups: ApiPermissionGroup[],
  selectedIds: ReadonlySet<number>,
): boolean {
  const allIds = collectPermissionIds(groups);
  return allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
}

export function splitPermissionGroupsIntoColumns(
  groups: ApiPermissionGroup[],
): [ApiPermissionGroup[], ApiPermissionGroup[]] {
  const midpoint = Math.ceil(groups.length / 2);
  return [groups.slice(0, midpoint), groups.slice(midpoint)];
}

export function sortPermissionsByAction(
  permissions: ApiPermission[],
): ApiPermission[] {
  const order = [
    "view",
    "create",
    "update",
    "edit",
    "delete",
    "approve",
    "reject",
    "upload",
    "download",
    "confirm",
    "assign",
    "hold",
    "process",
    "review",
    "cancel",
  ];

  return [...permissions].sort((a, b) => {
    const aKey = permissionActionKey(a.name);
    const bKey = permissionActionKey(b.name);
    const aIndex = order.indexOf(aKey);
    const bIndex = order.indexOf(bKey);
    const safeA = aIndex === -1 ? order.length : aIndex;
    const safeB = bIndex === -1 ? order.length : bIndex;
    if (safeA !== safeB) return safeA - safeB;
    return a.name.localeCompare(b.name);
  });
}
