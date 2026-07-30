"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  RenewalRequestStatsData,
  RenewalRequestStatsResponse,
} from "@/features/orders/types";

function formatPercent(val: unknown): string {
  if (typeof val === "number") {
    return val > 0 ? `+${val}%` : `${val}%`;
  }
  if (typeof val === "string" && val.trim()) {
    const trimmed = val.trim();
    return trimmed.endsWith("%") ? trimmed : `+${trimmed}%`;
  }
  return "-";
}

function parseNumber(data: Record<string, unknown>, keys: string[]): number | undefined {
  for (const k of keys) {
    if (typeof data[k] === "number") {
      return data[k] as number;
    }
  }
  return undefined;
}

async function fetchRenewalRequestStats(
  locale: string,
): Promise<RenewalRequestStatsData | number> {
  const response = await fetch("/api/orders/renewal-requests/stats", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | RenewalRequestStatsResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load renewal request stats",
    );
  }

  return payload.data;
}

export function useRenewalRequestStats() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: [...orderKeys.renewalRequestStats(), locale],
    queryFn: () => fetchRenewalRequestStats(locale),
    staleTime: 60 * 1000,
  });

  const rawData =
    query.data && typeof query.data === "object"
      ? (query.data as Record<string, unknown>)
      : null;

  const totalNew = rawData ? parseNumber(rawData, ["total_new", "new_requests", "new", "count"]) : undefined;
  const eFormCount = rawData ? parseNumber(rawData, ["e_form", "eform", "epayment"]) : undefined;
  const manualCount = rawData ? parseNumber(rawData, ["manual"]) : undefined;

  const totalChangePercent = rawData && "total_new_change_percent" in rawData
    ? formatPercent(rawData.total_new_change_percent)
    : rawData && "weekly_percentage" in rawData
      ? formatPercent(rawData.weekly_percentage)
      : "-";

  const eFormChangePercent = rawData && "e_form_change_percent" in rawData
    ? formatPercent(rawData.e_form_change_percent)
    : "-";

  const manualChangePercent = rawData && "manual_change_percent" in rawData
    ? formatPercent(rawData.manual_change_percent)
    : "-";

  return {
    ...query,
    newRequestsCount: totalNew,
    totalNew,
    eFormCount,
    manualCount,
    totalChangePercent,
    eFormChangePercent,
    manualChangePercent,
    weeklyPercentage: totalChangePercent,
  };
}
