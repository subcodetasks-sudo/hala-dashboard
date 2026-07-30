"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  CancelledStatsData,
  CancelledStatsResponse,
} from "@/features/orders/types";

async function fetchCancelledStats(
  locale: string,
): Promise<CancelledStatsData> {
  const response = await fetch(
    "/api/orders/renewal-requests/cancelled-stats",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | CancelledStatsResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load cancelled renewal request stats",
    );
  }

  return payload.data;
}

export function useRenewalRequestCancelledStats() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: [...orderKeys.renewalRequestCancelledStats(), locale],
    queryFn: () => fetchCancelledStats(locale),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    totalCancelled: query.data?.total_cancelled,
  };
}
