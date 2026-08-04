"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  ContentFilterValues,
  ContentRow,
  FaqApiItem,
  FaqsListResponse,
} from "@/features/content-management/types";
import { mapFaqToContentRow } from "@/features/content-management/utils/map-faq-to-content-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";
import type { AppLocale } from "@/lib/format-datetime";

function mapFilterStatusToApi(
  status: ContentFilterValues["status"]
): string | undefined {
  if (status === "published") return "active";
  if (status === "draft") return "inactive";
  return undefined;
}

function buildSearchParams(
  filters: ContentFilterValues,
  page?: number
): URLSearchParams {
  const params = new URLSearchParams();

  const search = filters.search.trim();
  if (search) {
    params.set("search", search);
  }

  const apiStatus = mapFilterStatusToApi(filters.status);
  if (apiStatus) {
    params.set("status", apiStatus);
  }

  if (page != null) {
    params.set("page", String(page));
  }

  return params;
}

async function fetchFaqsPage(
  locale: string,
  filters: ContentFilterValues,
  page: number
): Promise<{ rows: ContentRow[]; lastPage: number }> {
  const params = buildSearchParams(filters, page);
  const query = params.toString();
  const url = query
    ? `/api/content-management/faqs?${query}`
    : "/api/content-management/faqs";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | FaqsListResponse
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
        : "Failed to load FAQs"
    );
  }

  const items = extractCollection(payload.data) as FaqApiItem[];
  const meta = extractPaginationMeta(payload.data, {
    fallbackPage: page,
    itemCount: items.length,
  });

  return {
    rows: items.map((item) =>
      mapFaqToContentRow(item, locale as AppLocale)
    ),
    lastPage: meta.lastPage,
  };
}

async function fetchFaqsList(
  locale: string,
  filters: ContentFilterValues
): Promise<ContentRow[]> {
  const firstPage = await fetchFaqsPage(locale, filters, 1);

  if (firstPage.lastPage <= 1) {
    return firstPage.rows;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.lastPage - 1 }, (_, index) =>
      fetchFaqsPage(locale, filters, index + 2)
    )
  );

  return [
    ...firstPage.rows,
    ...remainingPages.flatMap((page) => page.rows),
  ];
}

/**
 * Fetches FAQs from `GET /admin/home/faqs` via the App Router proxy.
 */
export function useFaqsList(filters: ContentFilterValues, enabled = true) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.list("faqs", filters), locale],
    queryFn: () => fetchFaqsList(locale, filters),
    enabled,
  });
}
