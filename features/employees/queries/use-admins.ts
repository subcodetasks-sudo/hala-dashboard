"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { employeeKeys } from "@/features/employees/query-keys";
import type {
  AdminsListFilters,
  AdminsListResponse,
  Employee,
} from "@/features/employees/types";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";

export type AdminsPage = {
  items: Employee[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

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

async function fetchAdminsPage(
  locale: string,
  filters: AdminsListFilters,
): Promise<AdminsPage> {
  const params = buildSearchParams(filters);
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
    | (AdminsListResponse & { meta?: unknown })
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load employees",
    );
  }

  const items = extractCollection(payload.data) as Employee[];
  const pagination = extractPaginationMeta(payload.data, {
    fallbackPage: filters.page ?? 1,
    fallbackPerPage: filters.perPage ?? 15,
    itemCount: items.length,
    topLevelMeta: "meta" in payload ? payload.meta : undefined,
  });

  return {
    items,
    currentPage: pagination.currentPage,
    lastPage: pagination.lastPage,
    perPage: pagination.perPage,
    total: pagination.total,
  };
}

/**
 * Fetches every page when `page` is omitted (home dashboard cards).
 * When `page` is set, returns that single page only.
 */
async function fetchAdmins(
  locale: string,
  filters: AdminsListFilters,
): Promise<AdminsPage> {
  const firstPage = await fetchAdminsPage(
    locale,
    { ...filters, page: filters.page ?? 1 },
  );

  if (filters.page != null || firstPage.lastPage <= 1) {
    return firstPage;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.lastPage - 1 }, (_, index) =>
      fetchAdminsPage(locale, { ...filters, page: index + 2 }),
    ),
  );

  const items = [
    ...firstPage.items,
    ...remainingPages.flatMap((page) => page.items),
  ];

  return {
    items,
    currentPage: 1,
    lastPage: 1,
    perPage: items.length,
    total: firstPage.total || items.length,
  };
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
    placeholderData: keepPreviousData,
  });
}
