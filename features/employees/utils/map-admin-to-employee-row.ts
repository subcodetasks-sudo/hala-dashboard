import { HOME_EMPLOYEE_ROLE_GROUPS, ROLE_PERMISSIONS } from "@/features/employees/constants";
import type {
  Employee,
  EmployeeAccountStatus,
  EmployeeActivityStats,
  EmployeeDetail,
  EmployeeJobRole,
  EmployeeRow,
} from "@/features/employees/types";
import {
  formatApiDateTime,
  type AppLocale,
} from "@/lib/format-datetime";

function normalizeRoleIdentifier(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

/** Maps a backend role name to the employees-list UI role key. */
export function mapApiRoleToJobRole(
  roles: Employee["roles"] | undefined,
): EmployeeJobRole {
  const adminRoles = roles ?? [];

  for (const group of HOME_EMPLOYEE_ROLE_GROUPS) {
    const targets = new Set(group.roleNames.map(normalizeRoleIdentifier));
    const matched = adminRoles.some((role) =>
      targets.has(normalizeRoleIdentifier(role.name)),
    );
    if (matched) {
      return group.key;
    }
  }

  return "review";
}

/** Maps UI role filter values to the primary API `filter[role]` name. */
export function mapJobRoleToApiFilter(role: EmployeeJobRole): string {
  const group = HOME_EMPLOYEE_ROLE_GROUPS.find((item) => item.key === role);
  return group?.roleNames[0] ?? role;
}

function mapAccountStatus(status: string | undefined): EmployeeAccountStatus {
  const normalized = (status ?? "").trim().toLowerCase();

  if (
    normalized === "suspended" ||
    normalized === "inactive" ||
    normalized === "disabled" ||
    normalized === "banned"
  ) {
    return "suspended";
  }

  return "active";
}

function readOptionalNumber(value: unknown): number | undefined {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readActivityStats(admin: Employee): EmployeeActivityStats {
  const raw = admin as Employee & {
    activity?: unknown;
    todayRequests?: number | string | null;
    today_requests?: number | string | null;
    thisWeek?: number | string | null;
    this_week?: number | string | null;
    totalCompleted?: number | string | null;
    total_completed?: number | string | null;
  };

  const activity = isRecord(raw.activity) ? raw.activity : null;

  return {
    todayRequests:
      readOptionalNumber(activity?.todayRequests) ??
      readOptionalNumber(activity?.today_requests) ??
      readOptionalNumber(raw.todayRequests) ??
      readOptionalNumber(raw.today_requests) ??
      0,
    thisWeek:
      readOptionalNumber(activity?.thisWeek) ??
      readOptionalNumber(activity?.this_week) ??
      readOptionalNumber(raw.thisWeek) ??
      readOptionalNumber(raw.this_week) ??
      0,
    totalCompleted:
      readOptionalNumber(activity?.totalCompleted) ??
      readOptionalNumber(activity?.total_completed) ??
      readOptionalNumber(raw.totalCompleted) ??
      readOptionalNumber(raw.total_completed) ??
      0,
  };
}

/**
 * Maps a `/admins` list item into the employees table row shape.
 */
export function mapAdminToEmployeeRow(
  admin: Employee,
  locale: AppLocale = "en",
): EmployeeRow {
  const raw = admin as Employee & {
    dailyTarget?: number | string | null;
    daily_target?: number | string | null;
    employeeNumber?: string | null;
    employee_number?: string | null;
    id_number?: string | null;
    nationalId?: string | null;
    national_id?: string | null;
  };

  const created = formatApiDateTime(admin.createdAt, locale);
  const dailyTarget =
    readOptionalNumber(raw.dailyTarget) ??
    readOptionalNumber(raw.daily_target) ??
    0;

  const employeeNumber =
    (typeof raw.employeeNumber === "string" && raw.employeeNumber.trim()) ||
    (typeof raw.employee_number === "string" && raw.employee_number.trim()) ||
    String(admin.id);

  const idNumber =
    (typeof admin.idNumber === "string" && admin.idNumber.trim()) ||
    (typeof raw.id_number === "string" && raw.id_number.trim()) ||
    "";

  const nationalId =
    (typeof raw.nationalId === "string" && raw.nationalId.trim()) ||
    (typeof raw.national_id === "string" && raw.national_id.trim()) ||
    idNumber;

  return {
    id: String(admin.id),
    employeeNumber,
    idNumber,
    nationalId,
    name: admin.name?.trim() || "—",
    phone: admin.phone?.trim() || "—",
    email: admin.email?.trim() || "—",
    role: mapApiRoleToJobRole(admin.roles),
    dailyTarget,
    status: mapAccountStatus(admin.status),
    createdAtIso: created.isoDate,
    createdDate: created.dateLabel,
    createdTime: created.timeLabel,
    createdAtDateTime: admin.createdAt || created.isoDate,
    avatarUrl: admin.avatar || undefined,
  };
}

/**
 * Maps a `GET /admins/:id` payload into the employee details page shape.
 */
export function mapAdminToEmployeeDetail(
  admin: Employee,
  locale: AppLocale = "en",
): EmployeeDetail {
  const row = mapAdminToEmployeeRow(admin, locale);

  return {
    ...row,
    lastLoginAtDateTime: admin.lastLoginAt?.trim() || "",
    activity: readActivityStats(admin),
    permissions: ROLE_PERMISSIONS[row.role],
  };
}
