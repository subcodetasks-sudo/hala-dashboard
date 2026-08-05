"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  SupportCardRow,
  SupportCardsListResponse,
} from "@/features/content-management/types";
import {
  ensureSupportCardPair,
  mapSupportCardToRow,
} from "@/features/content-management/utils/map-support-card";
import { extractCollection } from "@/lib/api-payload";

async function fetchSupportCards(locale: string): Promise<SupportCardRow[]> {
  const response = await fetch(
    "/api/content-management/legal/support/cards",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | SupportCardsListResponse
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
        : "Failed to load support cards",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry, index) =>
      mapSupportCardToRow(entry, index === 0 ? 1 : 2),
    )
    .filter((row): row is SupportCardRow => row !== null);

  return ensureSupportCardPair(items);
}

export function useSupportCards() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.supportCards(), locale],
    queryFn: () => fetchSupportCards(locale),
  });
}
