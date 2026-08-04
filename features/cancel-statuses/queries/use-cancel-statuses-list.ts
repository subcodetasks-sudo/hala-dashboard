"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import {
  CANCEL_STATUSES_PER_PAGE,
  DEFAULT_CANCEL_STATUS_FILTERS,
} from "@/features/cancel-statuses/mock-data";
import { cancelStatusKeys } from "@/features/cancel-statuses/query-keys";
import type {
  CancelStatusFilterValues,
  CancelStatusesListResponse,
  CancelStatusesListResult,
} from "@/features/cancel-statuses/types";
import { mapCancelStatusToRow } from "@/features/cancel-statuses/utils/map-cancel-status-to-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";
import type { AppLocale } from "@/lib/format-datetime";

function buildSearchParams(
  filters: CancelStatusFilterValues,
  page: number,
  perPage: number,
): URLSearchParams {
  const params = new URLSearchParams();

  const search = filters.search.trim();
  if (search) {
    params.set("search", search);
  }

  if (filters.active === "active") {
    params.set("active", "1");
  } else if (filters.active === "inactive") {
    params.set("active", "0");
  }

  params.set("sort", "-created_at");
  params.set("per_page", String(perPage));
  params.set("page", String(page));

  return params;
}

async function fetchCancelStatusesList(
  locale: string,
  filters: CancelStatusFilterValues,
  page: number,
  perPage: number,
): Promise<CancelStatusesListResult> {
  const params = buildSearchParams(filters, page, perPage);
  const url = `/api/cancel-statuses?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | CancelStatusesListResponse
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
        : "Failed to load cancel statuses",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry) => mapCancelStatusToRow(entry, locale as AppLocale))
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

export function useCancelStatusesList(
  filters: CancelStatusFilterValues = DEFAULT_CANCEL_STATUS_FILTERS,
  page = 1,
  perPage = CANCEL_STATUSES_PER_PAGE,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...cancelStatusKeys.list(filters, page, perPage), locale],
    queryFn: () => fetchCancelStatusesList(locale, filters, page, perPage),
  });
}
