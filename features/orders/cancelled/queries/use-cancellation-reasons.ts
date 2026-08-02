"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type {
  CancellationReason,
  CancellationReasonsResponse,
} from "@/features/orders/types";

async function fetchCancellationReasons(
  locale: string,
): Promise<CancellationReason[]> {
  const response = await fetch("/api/orders/cancellation-reasons", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | CancellationReasonsResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load cancellation reasons",
    );
  }

  return payload.data;
}

/** Localized cancellation-reason options from the backend. */
export function useCancellationReasons() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...orderKeys.cancellationReasons(), locale],
    queryFn: () => fetchCancellationReasons(locale),
    staleTime: 5 * 60 * 1000,
  });
}
