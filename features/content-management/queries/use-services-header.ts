"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  ServicesHeaderApiItem,
  ServicesHeaderShowResponse,
} from "@/features/content-management/types";

async function fetchServicesHeader(
  locale: string,
): Promise<ServicesHeaderApiItem | null> {
  const response = await fetch("/api/content-management/services/header", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | ServicesHeaderShowResponse
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
        : "Failed to load services header",
    );
  }

  return payload.data ?? null;
}

export function useServicesHeader() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.servicesHeader(), locale],
    queryFn: () => fetchServicesHeader(locale),
  });
}
