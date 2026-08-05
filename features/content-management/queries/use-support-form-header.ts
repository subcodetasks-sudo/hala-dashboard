"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  SupportFormHeaderApiItem,
  SupportFormHeaderShowResponse,
} from "@/features/content-management/types";

async function fetchSupportFormHeader(
  locale: string,
): Promise<SupportFormHeaderApiItem | null> {
  const response = await fetch(
    "/api/content-management/legal/support/form-header",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | SupportFormHeaderShowResponse
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
        : "Failed to load support form header",
    );
  }

  return payload.data ?? null;
}

export function useSupportFormHeader() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.supportFormHeader(), locale],
    queryFn: () => fetchSupportFormHeader(locale),
  });
}
