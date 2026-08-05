"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  HeroApiItem,
  HeroShowResponse,
} from "@/features/content-management/types";

async function fetchHero(locale: string): Promise<HeroApiItem | null> {
  const response = await fetch("/api/content-management/hero", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | HeroShowResponse
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
        : "Failed to load hero section",
    );
  }

  return payload.data ?? null;
}

export function useHero() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.hero(), locale],
    queryFn: () => fetchHero(locale),
  });
}
