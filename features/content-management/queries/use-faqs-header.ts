"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  FaqsHeaderApiItem,
  FaqsHeaderShowResponse,
} from "@/features/content-management/types";

async function fetchFaqsHeader(
  locale: string,
): Promise<FaqsHeaderApiItem | null> {
  const response = await fetch("/api/content-management/faqs/header", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | FaqsHeaderShowResponse
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
        : "Failed to load FAQs header",
    );
  }

  return payload.data ?? null;
}

export function useFaqsHeader() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.faqsHeader(), locale],
    queryFn: () => fetchFaqsHeader(locale),
  });
}
