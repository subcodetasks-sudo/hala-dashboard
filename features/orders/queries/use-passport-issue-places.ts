"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  PassportIssuePlace,
  PassportIssuePlacesListFilters,
  PassportIssuePlacesListResponse,
} from "@/features/orders/types";
import {
  extractCollection,
  extractPaginationMeta,
  readStringField,
} from "@/lib/api-payload";

function buildSearchParams(
  filters: PassportIssuePlacesListFilters,
): URLSearchParams {
  const params = new URLSearchParams();

  const search = filters.search?.trim();
  if (search) {
    params.set("search", search);
  }

  if (filters.status) {
    params.set("filter[status]", filters.status);
  }

  if (filters.country) {
    params.set("filter[country]", filters.country);
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

  const value =
    nested[localeKey] ??
    nested[`name_${localeKey}`] ??
    nested[`name${localeKey === "ar" ? "Ar" : "En"}`];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizePassportIssuePlace(
  entry: unknown,
): PassportIssuePlace | null {
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

  const country = readStringField(entry, ["country"]) ?? null;
  const status =
    readStringField(entry, ["status"]) ??
    (typeof entry.status === "string" ? entry.status : null);

  return {
    id,
    name_ar: nameAr,
    name_en: nameEn,
    name,
    country,
    status,
    created_at: readStringField(entry, ["created_at", "createdAt"]) ?? null,
    updated_at: readStringField(entry, ["updated_at", "updatedAt"]) ?? null,
  };
}

async function fetchPassportIssuePlaces(
  locale: string,
  filters: PassportIssuePlacesListFilters,
): Promise<PassportIssuePlace[]> {
  const fetchPage = async (pageFilters: PassportIssuePlacesListFilters) => {
    const params = buildSearchParams(pageFilters);
    const query = params.toString();
    const url = query
      ? `/api/passport-issue-places?${query}`
      : "/api/passport-issue-places";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    });

    const payload = (await response.json().catch(() => null)) as
      | PassportIssuePlacesListResponse
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
          : "Failed to load passport issue places",
      );
    }

    const places = extractCollection(payload.data)
      .map(normalizePassportIssuePlace)
      .filter((place): place is PassportIssuePlace => place !== null);

    const pagination = extractPaginationMeta(payload.data, {
      fallbackPage: pageFilters.page ?? 1,
      fallbackPerPage: pageFilters.perPage ?? 15,
      itemCount: places.length,
    });

    return {
      places,
      lastPage: pagination.lastPage,
    };
  };

  const firstPage = await fetchPage({ ...filters, page: filters.page ?? 1 });

  if (filters.page != null || firstPage.lastPage <= 1) {
    return firstPage.places;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.lastPage - 1 }, (_, index) =>
      fetchPage({ ...filters, page: index + 2 }),
    ),
  );

  return [
    ...firstPage.places,
    ...remainingPages.flatMap((page) => page.places),
  ];
}

export type UsePassportIssuePlacesOptions = PassportIssuePlacesListFilters & {
  enabled?: boolean;
};

/**
 * Active passport issue places from `GET /admin/passport-issue-places`
 * via the App Router proxy. Pass `country: "sa" | "ph"` to filter by country.
 * Fetches all pages unless a specific `page` is requested.
 */
export function usePassportIssuePlaces(
  options: UsePassportIssuePlacesOptions = {},
) {
  const locale = useLocale();
  const {
    enabled = true,
    status = "active",
    sort = "-created_at",
    perPage = 15,
    ...rest
  } = options;

  const filters: PassportIssuePlacesListFilters = {
    ...rest,
    status,
    sort,
    perPage,
  };

  return useQuery({
    queryKey: [...orderKeys.passportIssuePlaces(filters), locale],
    queryFn: () => fetchPassportIssuePlaces(locale, filters),
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

/** Localized display label for a passport issue place. */
export function getPassportIssuePlaceLabel(
  place: PassportIssuePlace,
  locale: string,
): string {
  const raw = place as PassportIssuePlace & Record<string, unknown>;

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
    return nameAr || fallback || nameEn || String(place.id);
  }

  return nameEn || fallback || nameAr || String(place.id);
}
