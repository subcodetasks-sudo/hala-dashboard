"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { issuePlaceKeys } from "@/features/cities/query-keys";
import type {
  CityIndicators,
  CityStatus,
  IssuePlaceCountry,
  IssuePlacesListResponse,
} from "@/features/cities/types";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";

async function fetchIssuePlaceCount(
  locale: string,
  country: IssuePlaceCountry,
  status?: CityStatus,
): Promise<number> {
  const params = new URLSearchParams();
  params.set("per_page", "1");
  params.set("page", "1");
  params.set("sort", "-created_at");
  params.set("filter[country]", country);

  if (status) {
    params.set("filter[status]", status);
  }

  const response = await fetch(
    `/api/passport-issue-places?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

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
        : "Failed to load issuance place stats",
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

async function fetchIssuePlaceIndicators(
  locale: string,
  country: IssuePlaceCountry,
): Promise<CityIndicators> {
  const [total, active, inactive] = await Promise.all([
    fetchIssuePlaceCount(locale, country),
    fetchIssuePlaceCount(locale, country, "active"),
    fetchIssuePlaceCount(locale, country, "inactive"),
  ]);

  return { total, active, inactive };
}

/**
 * Total / active / inactive counts for the active country tab.
 */
export function useIssuePlacesIndicators(
  country: IssuePlaceCountry,
  enabled = true,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...issuePlaceKeys.indicators(country), locale],
    queryFn: () => fetchIssuePlaceIndicators(locale, country),
    enabled,
  });
}
