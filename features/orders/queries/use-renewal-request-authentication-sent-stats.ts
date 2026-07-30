"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  AuthenticationSentStatsData,
  AuthenticationSentStatsResponse,
} from "@/features/orders/types";

async function fetchAuthenticationSentStats(
  locale: string,
): Promise<AuthenticationSentStatsData> {
  const response = await fetch(
    "/api/orders/renewal-requests/authentication-sent-stats",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | AuthenticationSentStatsResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load authentication-sent renewal request stats",
    );
  }

  return payload.data;
}

export function useRenewalRequestAuthenticationSentStats() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: [...orderKeys.renewalRequestAuthenticationSentStats(), locale],
    queryFn: () => fetchAuthenticationSentStats(locale),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    totalSentForAuthentication: query.data?.total_sent_for_authentication,
    changePercent: query.data?.total_sent_for_authentication_change_percent,
  };
}
