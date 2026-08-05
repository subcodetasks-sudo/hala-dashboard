"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  LegalHeaderApiItem,
  LegalHeaderShowResponse,
  LegalPageKind,
} from "@/features/content-management/types";

async function fetchLegalHeader(
  locale: string,
  page: LegalPageKind,
): Promise<LegalHeaderApiItem | null> {
  const response = await fetch(
    `/api/content-management/legal/${page}/header`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | LegalHeaderShowResponse
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
        : "Failed to load legal header",
    );
  }

  return payload.data ?? null;
}

export function useLegalHeader(page: LegalPageKind) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.legalHeader(page), locale],
    queryFn: () => fetchLegalHeader(locale, page),
  });
}
