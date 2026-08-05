"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { pricingKeys } from "@/features/pricing/query-keys";
import type {
  PricingHeaderApiItem,
  PricingHeaderShowResponse,
} from "@/features/pricing/types";

async function fetchPricingHeader(
  locale: string,
): Promise<PricingHeaderApiItem | null> {
  const response = await fetch("/api/pricing/header", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | PricingHeaderShowResponse
    | { success?: false; message?: string }
    | null;

  if (
    !response.ok ||
    !payload ||
    !("success" in payload) ||
    !payload.success
  ) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load pricing header",
    );
  }

  return payload.data ?? null;
}

export function usePricingHeader() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...pricingKeys.header(), locale],
    queryFn: () => fetchPricingHeader(locale),
  });
}
