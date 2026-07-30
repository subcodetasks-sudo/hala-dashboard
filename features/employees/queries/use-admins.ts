"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { employeeKeys } from "@/features/employees/query-keys";
import type {
  AdminsListFilters,
  AdminsListResponse,
  Employee,
} from "@/features/employees/types";
import { extractCollection } from "@/features/orders/utils/api-payload";

function buildSearchParams(filters: AdminsListFilters): URLSearchParams {
  const params = new URLSearchParams();

  const search = filters.search?.trim();
  if (search) {
    params.set("search", search);
  }

  if (filters.status) {
    params.set("filter[status]", filters.status);
  }

  if (filters.role) {
    params.set("filter[role]", filters.role);
  }

  if (filters.createdFrom) {
    params.set("filter[created_from]", filters.createdFrom);
  }

  if (filters.createdTo) {
    params.set("filter[created_to]", filters.createdTo);
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  if (filters.perPage != null) {
    params.set("per_page", String(filters.perPage));
  }

  if (filters.page != null) {
    params.set("page", String(filters.page));
  }

  return params;
}

async function fetchAdmins(
  locale: string,
  filters: AdminsListFilters,
): Promise<Employee[]> {
  const fetchPage = async (pageFilters: AdminsListFilters) => {
    const params = buildSearchParams(pageFilters);
    const query = params.toString();
    const url = query ? `/api/admins?${query}` : "/api/admins";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    });

    const payload = (await response.json().catch(() => null)) as
      | AdminsListResponse
      | { success?: false; message?: string }
      | null;

    if (
      !response.ok ||
      !payload ||
      !("success" in payload) ||
      !payload.success
    ) {
      throw new Error(
        payload && "message" in payload && typeof payload.message === "string"
          ? payload.message
          : "Failed to load employees",
      );
    }

    return {
      employees: extractCollection(payload.data) as Employee[],
      lastPage:
        typeof payload.data.last_page === "number"
          ? payload.data.last_page
          : 1,
    };
  };

  const firstPage = await fetchPage({ ...filters, page: filters.page ?? 1 });

  if (filters.page != null || firstPage.lastPage <= 1) {
    return firstPage.employees;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.lastPage - 1 }, (_, index) =>
      fetchPage({ ...filters, page: index + 2 }),
    ),
  );

  return [
    ...firstPage.employees,
    ...remainingPages.flatMap((page) => page.employees),
  ];
}

export type UseAdminsOptions = AdminsListFilters & {
  enabled?: boolean;
};

/**
 * Fetches admins/employees from `GET /admins` via the App Router proxy.
 */
export function useAdmins(options: UseAdminsOptions = {}) {
  const locale = useLocale();
  const { enabled = true, ...filters } = options;

  return useQuery({
    queryKey: [...employeeKeys.list(filters), locale],
    queryFn: () => fetchAdmins(locale, filters),
    enabled,
  });
}
