import type {
  EmployeeAccountStatus,
  EmployeeJobRole,
  EmployeesFilterValues,
} from "@/features/employees/types";
import { parseIsoDateParam, toIsoDate } from "@/features/orders/utils";

const EMPLOYEE_FILTER_PARAM_KEYS = {
  createdAt: "createdAt",
  search: "search",
  role: "role",
  status: "status",
} as const;

const ROLE_FILTERS = [
  "all",
  "review",
  "dataProcessing",
  "contractFollowUp",
] as const satisfies readonly ("all" | EmployeeJobRole)[];

const STATUS_FILTERS = [
  "all",
  "active",
  "suspended",
] as const satisfies readonly ("all" | EmployeeAccountStatus)[];

function parseEnumParam<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  if (value && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  return fallback;
}

export function serializeEmployeesFilters(
  filters: EmployeesFilterValues,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.createdAt) {
    params.set(
      EMPLOYEE_FILTER_PARAM_KEYS.createdAt,
      toIsoDate(filters.createdAt),
    );
  }

  const search = filters.search.trim();
  if (search) {
    params.set(EMPLOYEE_FILTER_PARAM_KEYS.search, search);
  }

  if (filters.role !== "all") {
    params.set(EMPLOYEE_FILTER_PARAM_KEYS.role, filters.role);
  }

  if (filters.status !== "all") {
    params.set(EMPLOYEE_FILTER_PARAM_KEYS.status, filters.status);
  }

  return params;
}

export function parseEmployeesFilters(
  params: URLSearchParams,
  defaults: EmployeesFilterValues,
): EmployeesFilterValues {
  return {
    createdAt:
      parseIsoDateParam(params.get(EMPLOYEE_FILTER_PARAM_KEYS.createdAt)) ??
      defaults.createdAt,
    search:
      params.get(EMPLOYEE_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    role: parseEnumParam(
      params.get(EMPLOYEE_FILTER_PARAM_KEYS.role),
      ROLE_FILTERS,
      defaults.role,
    ),
    status: parseEnumParam(
      params.get(EMPLOYEE_FILTER_PARAM_KEYS.status),
      STATUS_FILTERS,
      defaults.status,
    ),
  };
}
