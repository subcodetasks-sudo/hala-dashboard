"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  PaymentStatsData,
  PaymentStatsResponse,
} from "@/features/orders/types";

async function fetchPaymentStats(locale: string): Promise<PaymentStatsData> {
  const response = await fetch("/api/orders/renewal-requests/payment-stats", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | PaymentStatsResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load payment renewal request stats",
    );
  }

  return payload.data;
}

export function useRenewalRequestPaymentStats() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: [...orderKeys.renewalRequestPaymentStats(), locale],
    queryFn: () => fetchPaymentStats(locale),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    awaitingPayment: query.data?.awaiting_payment,
  };
}
