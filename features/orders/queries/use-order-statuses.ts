"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  OrderStatus,
  OrderStatusOption,
  OrderStatusesResponse,
} from "@/features/orders/types";
import {
  extractCollection,
  readStringField,
} from "@/features/orders/utils/api-payload";

function toStatusOption(entry: unknown): OrderStatusOption | null {
  if (typeof entry === "string") {
    return { value: entry as OrderStatus, label: entry };
  }

  const value = readStringField(entry, ["value", "status", "key", "slug"]);
  if (!value) {
    return null;
  }

  const label = readStringField(entry, ["label", "status_label", "name", "title"]);

  return { value: value as OrderStatus, label: label ?? value };
}

function normalizeStatuses(data: unknown): OrderStatusOption[] {
  const entries = extractCollection(data, ["data", "statuses", "lists"]);

  if (entries.length > 0) {
    return entries
      .map(toStatusOption)
      .filter((option): option is OrderStatusOption => option !== null);
  }

  // Some endpoints return a `{ slug: label }` map instead of a list.
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return Object.entries(data as Record<string, unknown>).flatMap(
      ([value, label]) =>
        typeof label === "string"
          ? [{ value: value as OrderStatus, label }]
          : [],
    );
  }

  return [];
}

async function fetchOrderStatuses(locale: string): Promise<OrderStatusOption[]> {
  const response = await fetch("/api/orders/statuses", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | OrderStatusesResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load order statuses",
    );
  }

  return normalizeStatuses(payload.data);
}

/**
 * Localized order status options from `/admin/renewal-requests/statuses`.
 */
export function useOrderStatuses() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...orderKeys.statuses(), locale],
    queryFn: () => fetchOrderStatuses(locale),
    staleTime: 5 * 60 * 1000,
  });
}
