"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  OrderListItem,
  OrderListResponse,
  RenewalRequestsFilters,
} from "@/features/orders/types";
import { extractCollection } from "@/features/orders/utils/api-payload";
import { toApiOrderSource } from "@/features/orders/utils/map-order-list-item";
import type { OrderSource } from "@/features/home/types";

function buildSearchParams(filters: RenewalRequestsFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("filter[status]", filters.status);
  }

  if (filters.source && filters.source !== "all") {
    params.set("filter[source]", filters.source);
  }

  if (filters.holdReason) {
    params.set("filter[hold_reason]", filters.holdReason);
  }

  const search = filters.search?.trim();
  if (search) {
    params.set("search", search);
  }

  if (filters.createdFrom) {
    params.set("created_from", filters.createdFrom);
  }

  if (filters.createdTo) {
    params.set("created_to", filters.createdTo);
  }

  if (filters.expectedCompletionDate) {
    params.set("expected_completion_date", filters.expectedCompletionDate);
  }

  if (filters.perPage != null) {
    params.set("per_page", String(filters.perPage));
  }

  if (filters.page != null) {
    params.set("page", String(filters.page));
  }

  return params;
}

async function fetchRenewalRequests(
  locale: string,
  filters: RenewalRequestsFilters,
): Promise<OrderListItem[]> {
  const params = buildSearchParams(filters);
  const query = params.toString();
  const url = query
    ? `/api/orders/renewal-requests?${query}`
    : "/api/orders/renewal-requests";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | OrderListResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load renewal requests",
    );
  }

  return extractCollection(payload.data) as OrderListItem[];
}

export type UseRenewalRequestsOptions = RenewalRequestsFilters & {
  /** UI source filter (`eform` | `manual` | `all`) — mapped to API `e_form` | `manual`. */
  uiSource?: OrderSource | "all";
  enabled?: boolean;
};

/**
 * Fetches renewal requests from `/admin/renewal-requests` via the App Router proxy.
 */
export function useRenewalRequests(options: UseRenewalRequestsOptions = {}) {
  const locale = useLocale();
  const { uiSource, enabled = true, ...filters } = options;

  const resolvedFilters: RenewalRequestsFilters = {
    ...filters,
    source:
      filters.source ??
      (uiSource != null ? toApiOrderSource(uiSource) ?? "all" : filters.source),
  };

  return useQuery({
    queryKey: [...orderKeys.list(resolvedFilters), locale],
    queryFn: () => fetchRenewalRequests(locale, resolvedFilters),
    enabled,
  });
}
