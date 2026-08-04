"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import {
  DEFAULT_ISSUE_PLACE_FILTERS,
  ISSUE_PLACES_PER_PAGE,
} from "@/features/cities/mock-data";
import { issuePlaceKeys } from "@/features/cities/query-keys";
import type {
  CityFilterValues,
  IssuePlaceCountry,
  IssuePlacesListResponse,
  IssuePlacesListResult,
} from "@/features/cities/types";
import { mapIssuePlaceToRow } from "@/features/cities/utils/map-issue-place-to-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/features/orders/utils/api-payload";
import type { AppLocale } from "@/features/orders/utils/format-datetime";

function buildSearchParams(
  country: IssuePlaceCountry,
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

  params.set("filter[country]", country);
  params.set("sort", "-created_at");
  params.set("per_page", String(perPage));
  params.set("page", String(page));

  return params;
}

async function fetchIssuePlacesList(
  locale: string,
  country: IssuePlaceCountry,
  filters: CityFilterValues,
  page: number,
  perPage: number,
): Promise<IssuePlacesListResult> {
  const params = buildSearchParams(country, filters, page, perPage);
  const url = `/api/passport-issue-places?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | IssuePlacesListResponse
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
        : "Failed to load issuance places",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry) => mapIssuePlaceToRow(entry, locale as AppLocale))
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
 * Paginated passport issue places filtered by country.
 */
export function useIssuePlacesList(
  country: IssuePlaceCountry,
  filters: CityFilterValues = DEFAULT_ISSUE_PLACE_FILTERS,
  page = 1,
  perPage = ISSUE_PLACES_PER_PAGE,
  enabled = true,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: [
      ...issuePlaceKeys.list(country, filters, page, perPage),
      locale,
    ],
    queryFn: () =>
      fetchIssuePlacesList(locale, country, filters, page, perPage),
    enabled,
  });
}
