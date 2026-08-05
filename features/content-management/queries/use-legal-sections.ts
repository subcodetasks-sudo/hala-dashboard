"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import { LEGAL_SECTIONS_PER_PAGE } from "@/features/content-management/schemas/legal-section-form-schema";
import type {
  LegalPageKind,
  LegalSectionsListResponse,
  LegalSectionsListResult,
} from "@/features/content-management/types";
import { mapLegalSectionToRow } from "@/features/content-management/utils/map-legal-section-to-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";
import type { AppLocale } from "@/lib/format-datetime";

async function fetchLegalSections(
  locale: string,
  page: LegalPageKind,
  listPage: number,
  perPage: number,
): Promise<LegalSectionsListResult> {
  const params = new URLSearchParams({
    page: String(listPage),
    per_page: String(perPage),
  });

  const response = await fetch(
    `/api/content-management/legal/${page}/sections?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | LegalSectionsListResponse
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
        : "Failed to load legal sections",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry) => mapLegalSectionToRow(entry, locale as AppLocale))
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const meta = extractPaginationMeta(payload.data, {
    fallbackPage: listPage,
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

export function useLegalSections(
  page: LegalPageKind,
  listPage = 1,
  perPage = LEGAL_SECTIONS_PER_PAGE,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: [
      ...contentManagementKeys.legalSectionsList(page, listPage, perPage),
      locale,
    ],
    queryFn: () => fetchLegalSections(locale, page, listPage, perPage),
  });
}
