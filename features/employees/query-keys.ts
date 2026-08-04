import type {
  AdminsListFilters,
  EmployeesFilterValues,
} from "@/features/employees/types";

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters: AdminsListFilters | EmployeesFilterValues) =>
    [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
  indicators: () => [...employeeKeys.all, "indicators"] as const,
  roles: () => [...employeeKeys.all, "roles"] as const,
};
