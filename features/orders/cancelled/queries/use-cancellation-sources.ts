"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  CancellationSource,
  CancellationSourcesResponse,
} from "@/features/orders/types";

async function fetchCancellationSources(
  locale: string,
): Promise<CancellationSource[]> {
  const response = await fetch("/api/orders/cancellation-sources", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | CancellationSourcesResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load cancellation sources",
    );
  }

  return payload.data;
}

/** Localized cancellation-source options from the backend. */
export function useCancellationSources() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...orderKeys.cancellationSources(), locale],
    queryFn: () => fetchCancellationSources(locale),
    staleTime: 5 * 60 * 1000,
  });
}
