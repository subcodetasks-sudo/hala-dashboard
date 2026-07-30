"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  CompletedStatsData,
  CompletedStatsResponse,
} from "@/features/orders/types";

async function fetchCompletedStats(
  locale: string,
): Promise<CompletedStatsData> {
  const response = await fetch(
    "/api/orders/renewal-requests/completed-stats",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | CompletedStatsResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load completed renewal request stats",
    );
  }

  return payload.data;
}

export function useRenewalRequestCompletedStats() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: [...orderKeys.renewalRequestCompletedStats(), locale],
    queryFn: () => fetchCompletedStats(locale),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    totalCompleted: query.data?.total_completed,
  };
}
