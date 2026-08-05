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

async function fetchRenewalRequestHeldStats(
  locale: string,
): Promise<RenewalRequestStatsData | number> {
  const response = await fetch("/api/orders/renewal-requests/held-stats", {
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
        : "Failed to load held renewal request stats",
    );
  }

  return payload.data;
}

export function useRenewalRequestHeldStats() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: [...orderKeys.renewalRequestHeldStats(), locale],
    queryFn: () => fetchRenewalRequestHeldStats(locale),
    staleTime: 60 * 1000,
  });

  const rawData =
    query.data && typeof query.data === "object"
      ? (query.data as Record<string, unknown>)
      : null;

  const totalHeld = rawData ? parseNumber(rawData, ["total_held", "held_requests", "held", "pending"]) : undefined;
  const incompleteDataCount = rawData ? parseNumber(rawData, ["incomplete_data", "incomplete_data_count"]) : undefined;
  const missingDocumentsCount = rawData ? parseNumber(rawData, ["missing_documents", "missing_documents_count"]) : undefined;

  const totalHeldChangePercent = rawData && "total_held_change_percent" in rawData
    ? formatPercent(rawData.total_held_change_percent)
    : "-";

  const incompleteDataChangePercent = rawData && "incomplete_data_change_percent" in rawData
    ? formatPercent(rawData.incomplete_data_change_percent)
    : "-";

  const missingDocumentsChangePercent = rawData && "missing_documents_change_percent" in rawData
    ? formatPercent(rawData.missing_documents_change_percent)
    : "-";

  return {
    ...query,
    heldRequestsCount: totalHeld,
    totalHeld,
    incompleteDataCount,
    missingDocumentsCount,
    totalHeldChangePercent,
    incompleteDataChangePercent,
    missingDocumentsChangePercent,
    weeklyPercentage: totalHeldChangePercent,
  };
}
