"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { orderKeys } from "@/features/orders/query-keys";
import type { HoldReason, HoldReasonsResponse } from "@/features/orders/types";

async function fetchHoldReasons(locale: string): Promise<HoldReason[]> {
  const response = await fetch("/api/orders/hold-reasons", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | HoldReasonsResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load hold reasons",
    );
  }

  return payload.data;
}

/**
 * Localized hold/suspension reason options from the backend.
 */
export function useHoldReasons() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...orderKeys.holdReasons(), locale],
    queryFn: () => fetchHoldReasons(locale),
    staleTime: 5 * 60 * 1000,
  });
}
