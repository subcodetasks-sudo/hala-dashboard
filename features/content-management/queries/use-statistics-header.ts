"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  StatisticsHeaderApiItem,
  StatisticsHeaderShowResponse,
} from "@/features/content-management/types";

async function fetchStatisticsHeader(
  locale: string,
): Promise<StatisticsHeaderApiItem | null> {
  const response = await fetch("/api/content-management/statistics/header", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | StatisticsHeaderShowResponse
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
        : "Failed to load statistics header",
    );
  }

  return payload.data ?? null;
}

export function useStatisticsHeader() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.statisticsHeader(), locale],
    queryFn: () => fetchStatisticsHeader(locale),
  });
}
