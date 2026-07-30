"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  RefundStatsData,
  RefundStatsResponse,
} from "@/features/orders/types";

async function fetchRefundStats(locale: string): Promise<RefundStatsData> {
  const response = await fetch("/api/orders/renewal-requests/refund-stats", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | RefundStatsResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load refund renewal request stats",
    );
  }

  return payload.data;
}

export function useRenewalRequestRefundStats() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: [...orderKeys.renewalRequestRefundStats(), locale],
    queryFn: () => fetchRefundStats(locale),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    totalRefundRequests: query.data?.total_refund_requests,
  };
}
