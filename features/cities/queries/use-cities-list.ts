"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import {
  CITIES_PER_PAGE,
  DEFAULT_CITY_FILTERS,
} from "@/features/cities/mock-data";
import { citiesKeys } from "@/features/cities/query-keys";
import type {
  CitiesListResponse,
  CitiesListResult,
  CitiesTab,
  CityFilterValues,
} from "@/features/cities/types";
import { mapCityToRow } from "@/features/cities/utils/map-city-to-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";
import type { AppLocale } from "@/lib/format-datetime";

function buildSearchParams(
  filters: CityFilterValues,
  page: number,
  perPage: number,
): URLSearchParams {
  const params = new URLSearchParams();

  const search = filters.search.trim();
  if (search) {
    params.set("search", search);
  }

  if (filters.status !== "all") {
    params.set("filter[status]", filters.status);
  }

  params.set("sort", "-created_at");
  params.set("per_page", String(perPage));
  params.set("page", String(page));

  return params;
}

async function fetchCitiesList(
  locale: string,
  filters: CityFilterValues,
  page: number,
  perPage: number,
): Promise<CitiesListResult> {
  const params = buildSearchParams(filters, page, perPage);
  const url = `/api/cities?${params.toString()}`;

  const response = await fetch(url, {
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
        : "Failed to load cities",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry) => mapCityToRow(entry, locale as AppLocale))
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const meta = extractPaginationMeta(payload.data, {
    fallbackPage: page,
    fallbackPerPage: perPage,
    itemCount: items.length,
  });

  return {
    items,
    currentPage: meta.currentPage,
    lastPage: meta.lastPage,
    perPage: meta.perPage,
    total: meta.total,
  };
}

/**
 * Paginated cities from `GET /admin/cities` via the App Router proxy.
 */
export function useCitiesList(
  tab: CitiesTab,
  filters: CityFilterValues = DEFAULT_CITY_FILTERS,
  page = 1,
  perPage = CITIES_PER_PAGE,
) {
  const locale = useLocale();
  const enabled = tab === "cities";

  return useQuery({
    queryKey: [...citiesKeys.list(tab, filters, page, perPage), locale],
    queryFn: () => fetchCitiesList(locale, filters, page, perPage),
    enabled,
  });
}
