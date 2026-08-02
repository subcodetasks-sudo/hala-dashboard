"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  CitiesListFilters,
  CitiesListResponse,
  City,
} from "@/features/orders/types";
import {
  extractCollection,
  readStringField,
} from "@/features/orders/utils/api-payload";

function buildSearchParams(filters: CitiesListFilters): URLSearchParams {
  const params = new URLSearchParams();

  const search = filters.search?.trim();
  if (search) {
    params.set("search", search);
  }

  if (filters.status) {
    params.set("filter[status]", filters.status);
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNestedLocalizedName(
  entry: Record<string, unknown>,
  key: string,
  localeKey: "ar" | "en",
): string | undefined {
  const nested = entry[key];
  if (!isRecord(nested)) {
    return undefined;
  }

  const value = nested[localeKey] ?? nested[`name_${localeKey}`] ?? nested[`name${localeKey === "ar" ? "Ar" : "En"}`];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeCity(entry: unknown): City | null {
  if (!isRecord(entry)) {
    return null;
  }

  const rawId = entry.id;
  const id =
    typeof rawId === "number" && Number.isFinite(rawId)
      ? rawId
      : typeof rawId === "string" && rawId.trim()
        ? Number(rawId)
        : NaN;

  if (!Number.isFinite(id)) {
    return null;
  }

  const nameAr =
    readStringField(entry, ["name_ar", "nameAr", "title_ar", "titleAr"]) ??
    readNestedLocalizedName(entry, "name", "ar") ??
    readNestedLocalizedName(entry, "title", "ar") ??
    "";

  const nameEn =
    readStringField(entry, ["name_en", "nameEn", "title_en", "titleEn"]) ??
    readNestedLocalizedName(entry, "name", "en") ??
    readNestedLocalizedName(entry, "title", "en") ??
    "";

  const name =
    readStringField(entry, ["name", "title", "label", "status_label"]) ?? null;

  const status =
    readStringField(entry, ["status"]) ??
    (typeof entry.status === "string" ? entry.status : null);

  return {
    id,
    name_ar: nameAr,
    name_en: nameEn,
    name,
    status,
    created_at:
      readStringField(entry, ["created_at", "createdAt"]) ?? null,
    updated_at:
      readStringField(entry, ["updated_at", "updatedAt"]) ?? null,
  };
}

async function fetchCities(
  locale: string,
  filters: CitiesListFilters,
): Promise<City[]> {
  const fetchPage = async (pageFilters: CitiesListFilters) => {
    const params = buildSearchParams(pageFilters);
    const query = params.toString();
    const url = query ? `/api/cities?${query}` : "/api/cities";

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

    const cities = extractCollection(payload.data)
      .map(normalizeCity)
      .filter((city): city is City => city !== null);

    return {
      cities,
      lastPage:
        typeof payload.data.last_page === "number"
          ? payload.data.last_page
          : typeof (payload.data as { lastPage?: number }).lastPage === "number"
            ? (payload.data as { lastPage: number }).lastPage
            : 1,
    };
  };

  const firstPage = await fetchPage({ ...filters, page: filters.page ?? 1 });

  if (filters.page != null || firstPage.lastPage <= 1) {
    return firstPage.cities;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.lastPage - 1 }, (_, index) =>
      fetchPage({ ...filters, page: index + 2 }),
    ),
  );

  return [
    ...firstPage.cities,
    ...remainingPages.flatMap((page) => page.cities),
  ];
}

export type UseCitiesOptions = CitiesListFilters & {
  enabled?: boolean;
};

/**
 * Active cities from `GET /admin/cities` via the App Router proxy.
 * Fetches all pages unless a specific `page` is requested.
 */
export function useCities(options: UseCitiesOptions = {}) {
  const locale = useLocale();
  const {
    enabled = true,
    status = "active",
    sort = "-created_at",
    perPage = 15,
    ...rest
  } = options;

  const filters: CitiesListFilters = {
    ...rest,
    status,
    sort,
    perPage,
  };

  return useQuery({
    queryKey: [...orderKeys.cities(filters), locale],
    queryFn: () => fetchCities(locale, filters),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

function readTrimmedString(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function readNestedLocaleName(
  value: unknown,
  localeKey: "ar" | "en",
): string {
  if (!isRecord(value)) {
    return "";
  }

  return (
    readTrimmedString(value[localeKey]) ||
    readTrimmedString(value[`name_${localeKey}`]) ||
    readTrimmedString(value[`name${localeKey === "ar" ? "Ar" : "En"}`])
  );
}

/** Localized display label for a city row (snake_case or camelCase API fields). */
export function getCityLabel(city: City, locale: string): string {
  const raw = city as City & Record<string, unknown>;

  const nameAr =
    readTrimmedString(raw.name_ar) ||
    readTrimmedString(raw.nameAr) ||
    readTrimmedString(raw.title_ar) ||
    readTrimmedString(raw.titleAr) ||
    readNestedLocaleName(raw.name, "ar") ||
    readNestedLocaleName(raw.title, "ar");

  const nameEn =
    readTrimmedString(raw.name_en) ||
    readTrimmedString(raw.nameEn) ||
    readTrimmedString(raw.title_en) ||
    readTrimmedString(raw.titleEn) ||
    readNestedLocaleName(raw.name, "en") ||
    readNestedLocaleName(raw.title, "en");

  const fallback =
    readTrimmedString(raw.name) ||
    readTrimmedString(raw.title) ||
    readTrimmedString(raw.label);

  if (locale === "ar") {
    return nameAr || fallback || nameEn || String(city.id);
  }

  return nameEn || fallback || nameAr || String(city.id);
}
