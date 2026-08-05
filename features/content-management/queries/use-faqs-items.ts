"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import { FAQS_ITEMS_PER_PAGE } from "@/features/content-management/schemas/faq-item-form-schema";
import type {
  FaqsItemsListResult,
  FaqsListResponse,
} from "@/features/content-management/types";
import { mapFaqToRow } from "@/features/content-management/utils/map-faq-to-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";
import type { AppLocale } from "@/lib/format-datetime";

async function fetchFaqsItems(
  locale: string,
  page: number,
  perPage: number,
): Promise<FaqsItemsListResult> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  const response = await fetch(
    `/api/content-management/faqs?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

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
        : "Failed to load FAQ items",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry) => mapFaqToRow(entry, locale as AppLocale))
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

export function useFaqsItems(page = 1, perPage = FAQS_ITEMS_PER_PAGE) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.faqsItemsList(page, perPage), locale],
    queryFn: () => fetchFaqsItems(locale, page, perPage),
  });
}
