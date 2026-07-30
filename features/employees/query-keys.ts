import type { AdminsListFilters } from "@/features/employees/types";

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters: AdminsListFilters) =>
    [...employeeKeys.lists(), filters] as const,
  roles: () => [...employeeKeys.all, "roles"] as const,
};
