"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { citiesKeys } from "@/features/cities/query-keys";
import type { CityDetailResponse, CityRow } from "@/features/cities/types";
import { mapCityToRow } from "@/features/cities/utils/map-city-to-row";
import type { AppLocale } from "@/features/orders/utils/format-datetime";

async function fetchCity(
  locale: string,
  cityId: number,
): Promise<CityRow> {
  const response = await fetch(
    `/api/cities/${encodeURIComponent(String(cityId))}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | CityDetailResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success || !("data" in payload) || !payload.data) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to load city",
    );
  }

  const row = mapCityToRow(payload.data, locale as AppLocale);
  if (!row) {
    throw new Error("Unable to load city");
  }

  return row;
}

/**
 * Single city from `GET /admin/cities/:id` via the App Router proxy.
 */
export function useCity(cityId: number | null, enabled = true) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...citiesKeys.detail(cityId ?? 0), locale],
    queryFn: () => fetchCity(locale, cityId as number),
    enabled: enabled && cityId != null && Number.isFinite(cityId),
  });
}
