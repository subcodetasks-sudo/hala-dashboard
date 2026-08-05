"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import { INQUIRY_TYPES_PER_PAGE } from "@/features/content-management/schemas/inquiry-type-form-schema";
import type {
  InquiryTypesListResponse,
  InquiryTypesListResult,
} from "@/features/content-management/types";
import { mapInquiryTypeToRow } from "@/features/content-management/utils/map-inquiry-type-to-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";
import type { AppLocale } from "@/lib/format-datetime";

async function fetchInquiryTypes(
  locale: string,
  page: number,
  perPage: number,
): Promise<InquiryTypesListResult> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  const response = await fetch(
    `/api/content-management/legal/support/inquiry-types?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | InquiryTypesListResponse
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
        : "Failed to load inquiry types",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry) => mapInquiryTypeToRow(entry, locale as AppLocale))
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

export function useInquiryTypes(
  page = 1,
  perPage = INQUIRY_TYPES_PER_PAGE,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: [
      ...contentManagementKeys.inquiryTypesList(page, perPage),
      locale,
    ],
    queryFn: () => fetchInquiryTypes(locale, page, perPage),
  });
}
