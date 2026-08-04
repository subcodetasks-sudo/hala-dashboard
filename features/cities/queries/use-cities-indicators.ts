"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { citiesKeys } from "@/features/cities/query-keys";
import type {
  CitiesListResponse,
  CitiesTab,
  CityIndicators,
  CityStatus,
} from "@/features/cities/types";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/features/orders/utils/api-payload";

async function fetchCityCount(
  locale: string,
  status?: CityStatus,
): Promise<number> {
  const params = new URLSearchParams();
  params.set("per_page", "1");
  params.set("page", "1");
  params.set("sort", "-created_at");

  if (status) {
    params.set("filter[status]", status);
  }

  const response = await fetch(`/api/cities?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | CitiesListResponse
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
        : "Failed to load city stats",
    );
  }

  const items = extractCollection(payload.data);
  const meta = extractPaginationMeta(payload.data, {
    fallbackPage: 1,
    fallbackPerPage: 1,
    itemCount: items.length,
  });

  return meta.total;
}

async function fetchCityIndicators(locale: string): Promise<CityIndicators> {
  const [total, active, inactive] = await Promise.all([
    fetchCityCount(locale),
    fetchCityCount(locale, "active"),
    fetchCityCount(locale, "inactive"),
  ]);

  return { total, active, inactive };
}

/**
 * Total / active / inactive counts for the cities tab.
 */
export function useCitiesIndicators(tab: CitiesTab) {
  const locale = useLocale();
  const enabled = tab === "cities";

  return useQuery({
    queryKey: [...citiesKeys.indicators(tab), locale],
    queryFn: () => fetchCityIndicators(locale),
    enabled,
  });
}
