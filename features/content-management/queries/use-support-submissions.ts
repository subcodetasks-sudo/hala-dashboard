"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  SupportSubmissionsListResponse,
  SupportSubmissionsListResult,
} from "@/features/content-management/types";
import { mapSupportSubmissionToRow } from "@/features/content-management/utils/map-support-submission-to-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";
import type { AppLocale } from "@/lib/format-datetime";

export const SUPPORT_SUBMISSIONS_PER_PAGE = 15;

async function fetchSupportSubmissions(
  locale: string,
  page: number,
  perPage: number,
): Promise<SupportSubmissionsListResult> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  const response = await fetch(
    `/api/content-management/legal/support/submissions?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | SupportSubmissionsListResponse
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
        : "Failed to load support submissions",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry) => mapSupportSubmissionToRow(entry, locale as AppLocale))
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

export function useSupportSubmissions(
  page = 1,
  perPage = SUPPORT_SUBMISSIONS_PER_PAGE,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: [
      ...contentManagementKeys.supportSubmissionsList(page, perPage),
      locale,
    ],
    queryFn: () => fetchSupportSubmissions(locale, page, perPage),
  });
}
