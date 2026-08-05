"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { pricingKeys } from "@/features/pricing/query-keys";
import { PACKAGES_PER_PAGE } from "@/features/pricing/schemas/package-form-schema";
import type {
  PackagesListResponse,
  PackagesListResult,
} from "@/features/pricing/types";
import { mapPackageToRow } from "@/features/pricing/utils/map-package-to-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";
import type { AppLocale } from "@/lib/format-datetime";

async function fetchPackages(
  locale: string,
  page: number,
  perPage: number,
): Promise<PackagesListResult> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  const response = await fetch(`/api/pricing/packages?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | PackagesListResponse
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
        : "Failed to load packages",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry) => mapPackageToRow(entry, locale as AppLocale))
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

export function usePackages(page = 1, perPage = PACKAGES_PER_PAGE) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...pricingKeys.packagesList(page, perPage), locale],
    queryFn: () => fetchPackages(locale, page, perPage),
  });
}
