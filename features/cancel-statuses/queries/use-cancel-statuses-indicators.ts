"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { cancelStatusKeys } from "@/features/cancel-statuses/query-keys";
import type {
  CancelStatusIndicators,
  CancelStatusesListResponse,
} from "@/features/cancel-statuses/types";
import { mapCancelStatusToRow } from "@/features/cancel-statuses/utils/map-cancel-status-to-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/features/orders/utils/api-payload";
import type { AppLocale } from "@/features/orders/utils/format-datetime";

async function fetchAllCancelStatuses(
  locale: string,
): Promise<CancelStatusIndicators> {
  const fetchPage = async (page: number) => {
    const params = new URLSearchParams();
    params.set("per_page", "100");
    params.set("page", String(page));
    params.set("sort", "-created_at");

    const response = await fetch(`/api/cancel-statuses?${params.toString()}`, {
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
          : "Failed to load cancel status stats",
      );
    }

    const items = extractCollection(payload.data)
      .map((entry) => mapCancelStatusToRow(entry, locale as AppLocale))
      .filter((row): row is NonNullable<typeof row> => row !== null);

    const meta = extractPaginationMeta(payload.data, {
      fallbackPage: page,
      fallbackPerPage: 100,
      itemCount: items.length,
    });

    return { items, lastPage: meta.lastPage };
  };

  const firstPage = await fetchPage(1);
  const remaining =
    firstPage.lastPage <= 1
      ? []
      : await Promise.all(
          Array.from({ length: firstPage.lastPage - 1 }, (_, index) =>
            fetchPage(index + 2),
          ),
        );

  const allItems = [
    ...firstPage.items,
    ...remaining.flatMap((page) => page.items),
  ];

  const active = allItems.filter((item) => item.active).length;
  const inactive = allItems.length - active;

  return {
    total: allItems.length,
    active,
    inactive,
  };
}

/**
 * Counts total / active / inactive from the full cancel-statuses list.
 * Uses item `active` flags so cards stay correct even when the API
 * `active` query filter is ignored.
 */
export function useCancelStatusesIndicators() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...cancelStatusKeys.indicators(), locale],
    queryFn: () => fetchAllCancelStatuses(locale),
  });
}
