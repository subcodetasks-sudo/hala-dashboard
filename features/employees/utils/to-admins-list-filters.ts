import { mapJobRoleToApiFilter } from "@/features/employees/utils/map-admin-to-employee-row";
import type {
  AdminsListFilters,
  EmployeesFilterValues,
} from "@/features/employees/types";
import { toIsoDate } from "@/lib/iso-date";

export const EMPLOYEES_LIST_PER_PAGE = 15;
export const EMPLOYEES_LIST_SORT = "-created_at";

/**
 * Converts employees list UI filters into `GET /admins` query params.
 */
export function toAdminsListFilters(
  filters: EmployeesFilterValues,
  options: { page?: number; perPage?: number; sort?: string } = {},
): AdminsListFilters {
  const createdIso = filters.createdAt
    ? toIsoDate(filters.createdAt)
    : undefined;

  return {
    search: filters.search.trim() || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    role:
      filters.role === "all"
        ? undefined
        : mapJobRoleToApiFilter(filters.role),
    createdFrom: createdIso,
    createdTo: createdIso,
    sort: options.sort ?? EMPLOYEES_LIST_SORT,
    perPage: options.perPage ?? EMPLOYEES_LIST_PER_PAGE,
    page: options.page,
  };
}
