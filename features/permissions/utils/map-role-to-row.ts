import type {
  ApiPermission,
  ApiRole,
  PermissionRoleKey,
  PermissionRoleRow,
  PermissionRoleStatus,
} from "@/features/permissions/types";
import { readStringField } from "@/lib/api-payload";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function normalizeRoleName(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

const ROLE_NAME_TO_KEY: Record<string, PermissionRoleKey> = {
  admin: "systemAdmin",
  "super-admin": "systemAdmin",
  "system-admin": "systemAdmin",
  review: "review",
  reviewer: "review",
  "review-officer": "review",
  "data-entry": "dataProcessing",
  "data-processing": "dataProcessing",
  "contract-officer": "contractFollowUp",
  "contract-follow-up": "contractFollowUp",
  "contract-approval": "contractApproval",
  "contract-payments": "contractPayments",
};

/** Maps a backend role `name` to a known UI role key when possible. */
export function mapApiRoleNameToKey(
  name: string | null | undefined,
): PermissionRoleKey | null {
  if (!name) return null;
  return ROLE_NAME_TO_KEY[normalizeRoleName(name)] ?? null;
}

function mapStatus(value: string | null | undefined): PermissionRoleStatus {
  const normalized = (value ?? "").trim().toLowerCase();
  if (
    normalized === "inactive" ||
    normalized === "disabled" ||
    normalized === "stopped" ||
    normalized === "0" ||
    normalized === "false"
  ) {
    return "inactive";
  }
  return "active";
}

function parsePermission(entry: unknown): ApiPermission | null {
  if (!isRecord(entry)) return null;

  const id = toFiniteNumber(entry.id);
  const name = readStringField(entry, ["name"]) ?? "";
  const moduleName =
    readStringField(entry, ["module", "module_name", "moduleName"]) ?? "";
  const guardName =
    readStringField(entry, ["guardName", "guard_name"]) ?? "web";
  const createdAt =
    readStringField(entry, ["createdAt", "created_at"]) ?? "";
  const updatedAt =
    readStringField(entry, ["updatedAt", "updated_at"]) ?? "";

  if (id == null || !name || !moduleName) {
    return null;
  }

  return {
    id,
    name,
    module: moduleName,
    guardName,
    createdAt,
    updatedAt,
  };
}

/** Normalizes a `GET /v1/roles` item into a permissions table row. */
export function mapRoleToRow(entry: unknown): PermissionRoleRow | null {
  if (!isRecord(entry)) {
    return null;
  }

  const id = toFiniteNumber(entry.id);
  const name = readStringField(entry, ["name"]) ?? "";
  const label = readStringField(entry, ["label"]) ?? name;

  if (id == null || !name) {
    return null;
  }

  const permissions = Array.isArray(entry.permissions)
    ? entry.permissions
        .map(parsePermission)
        .filter((permission): permission is ApiPermission => permission !== null)
    : [];

  const permissionsCount =
    toFiniteNumber(entry.permissionsCount) ??
    toFiniteNumber(entry.permissions_count) ??
    permissions.length;

  const updatedAt =
    readStringField(entry, ["updatedAt", "updated_at"]) ??
    readStringField(entry, ["createdAt", "created_at"]) ??
    "";

  const isoDate = updatedAt.includes(" ")
    ? updatedAt.split(" ")[0] ?? updatedAt
    : updatedAt.slice(0, 10);

  const isProtected = Boolean(
    entry.isProtected === true ||
      entry.is_protected === true ||
      entry.isProtected === 1 ||
      entry.is_protected === 1,
  );

  const status = mapStatus(readStringField(entry, ["status"]));

  return {
    id: String(id),
    name,
    label,
    roleKey: mapApiRoleNameToKey(name),
    permissionsCount,
    status,
    isProtected,
    updatedAtIso: isoDate,
    updatedAtDateTime: updatedAt,
    permissions,
  };
}

/** Groups a role's flat permissions list by `module`. */
export function groupRolePermissionsByModule(
  permissions: ApiPermission[],
): { module: string; permissions: ApiPermission[] }[] {
  const byModule = new Map<string, ApiPermission[]>();

  for (const permission of permissions) {
    const existing = byModule.get(permission.module);
    if (existing) {
      existing.push(permission);
    } else {
      byModule.set(permission.module, [permission]);
    }
  }

  return Array.from(byModule.entries()).map(([module, items]) => ({
    module,
    permissions: items,
  }));
}

export function filterPermissionRoles(
  roles: PermissionRoleRow[],
  filters: {
    search: string;
    role: "all" | string;
    status: "all" | PermissionRoleStatus;
  },
): PermissionRoleRow[] {
  const query = filters.search.trim().toLowerCase();

  return roles.filter((role) => {
    if (filters.role !== "all" && role.name !== filters.role) {
      return false;
    }

    if (filters.status !== "all" && role.status !== filters.status) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      role.label.toLowerCase().includes(query) ||
      role.name.toLowerCase().includes(query)
    );
  });
}

/** Narrow helper when a caller already has a typed `ApiRole`. */
export function mapApiRoleToRow(role: ApiRole): PermissionRoleRow {
  return mapRoleToRow(role) as PermissionRoleRow;
}
