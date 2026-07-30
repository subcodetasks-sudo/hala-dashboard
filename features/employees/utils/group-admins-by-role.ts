import {
  AVATAR_FALLBACK_CLASSES,
  HOME_EMPLOYEE_ROLE_GROUPS,
} from "@/features/employees/constants";
import type {
  Employee,
  EmployeeRoleGroup,
  Role,
} from "@/features/employees/types";

function normalizeRoleIdentifier(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function matchesRoleNames(
  value: string | undefined,
  targets: ReadonlySet<string>,
) {
  return Boolean(value) && targets.has(normalizeRoleIdentifier(value ?? ""));
}

function resolveRoleIds(roles: Role[], targets: ReadonlySet<string>) {
  return new Set(
    roles
      .filter((role) => matchesRoleNames(role.name, targets))
      .map((role) => role.id),
  );
}

function adminHasRole(
  admin: Employee,
  roleIds: ReadonlySet<number>,
  targets: ReadonlySet<string>,
) {
  return (admin.roles ?? []).some(
    (role) => roleIds.has(role.id) || matchesRoleNames(role.name, targets),
  );
}

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

/**
 * Groups admins into the three home-page role cards (count + avatars).
 */
export function groupAdminsByHomeRoles(
  admins: Employee[],
  roles: Role[],
): EmployeeRoleGroup[] {
  return HOME_EMPLOYEE_ROLE_GROUPS.map(({ key, roleNames }, groupIndex) => {
    const targets = new Set(roleNames.map(normalizeRoleIdentifier));
    const roleIds = resolveRoleIds(roles, targets);
    const members = admins.filter((admin) =>
      adminHasRole(admin, roleIds, targets),
    );

    return {
      key,
      count: members.length,
      avatars: members.map((admin, index) => ({
        name: admin.name?.trim() || `Admin ${admin.id}`,
        src: admin.avatar || undefined,
        fallback: initialsFromName(admin.name?.trim() || "?"),
        fallbackClassName:
          AVATAR_FALLBACK_CLASSES[
            (groupIndex + index) % AVATAR_FALLBACK_CLASSES.length
          ],
      })),
    };
  });
}

export function emptyEmployeeRoleGroups(): EmployeeRoleGroup[] {
  return HOME_EMPLOYEE_ROLE_GROUPS.map(({ key }) => ({
    key,
    count: 0,
    avatars: [],
  }));
}
