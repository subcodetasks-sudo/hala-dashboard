"use client";

import { useQueries } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { employeeKeys } from "@/features/employees/query-keys";
import type {
  AdminsListFilters,
  AdminsListResponse,
} from "@/features/employees/types";
import {
  EMPLOYEES_LIST_SORT,
} from "@/features/employees/utils/to-admins-list-filters";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";

export type EmployeeIndicators = {
  total: number;
  active: number;
  suspended: number;
  changePercent?: number;
};

async function fetchAdminsTotal(
  locale: string,
  filters: AdminsListFilters,
): Promise<number> {
  const params = new URLSearchParams();
  params.set("per_page", "1");
  params.set("page", "1");
  params.set("sort", filters.sort ?? EMPLOYEES_LIST_SORT);

  if (filters.status) {
    params.set("filter[status]", filters.status);
  }

  const response = await fetch(`/api/admins?${params.toString()}`, {
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
        : "Failed to load employee indicators",
    );
  }

  const items = extractCollection(payload.data);
  const pagination = extractPaginationMeta(payload.data, {
    fallbackPage: 1,
    fallbackPerPage: 1,
    itemCount: items.length,
    topLevelMeta: "meta" in payload ? payload.meta : undefined,
  });

  return pagination.total;
}

/**
 * Summary indicator cards for the employees page (totals from `/admins`).
 */
export function useEmployeeIndicators() {
  const locale = useLocale();

  const results = useQueries({
    queries: [
      {
        queryKey: [...employeeKeys.indicators(), "total", locale],
        queryFn: () => fetchAdminsTotal(locale, {}),
      },
      {
        queryKey: [...employeeKeys.indicators(), "active", locale],
        queryFn: () => fetchAdminsTotal(locale, { status: "active" }),
      },
      {
        queryKey: [...employeeKeys.indicators(), "suspended", locale],
        queryFn: () => fetchAdminsTotal(locale, { status: "suspended" }),
      },
    ],
  });

  const [totalQuery, activeQuery, suspendedQuery] = results;
  const isLoading = results.some((query) => query.isLoading);
  const isError = results.some((query) => query.isError);

  const data: EmployeeIndicators | undefined =
    isLoading || isError
      ? undefined
      : {
          total: totalQuery.data ?? 0,
          active: activeQuery.data ?? 0,
          suspended: suspendedQuery.data ?? 0,
        };

  return {
    data,
    isLoading,
    isError,
    error: results.find((query) => query.error)?.error,
  };
}
