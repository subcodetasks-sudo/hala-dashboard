"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { issuePlaceKeys } from "@/features/cities/query-keys";
import type {
  IssuePlaceDetailResponse,
  IssuePlaceRow,
} from "@/features/cities/types";
import { mapIssuePlaceToRow } from "@/features/cities/utils/map-issue-place-to-row";
import type { AppLocale } from "@/features/orders/utils/format-datetime";

async function fetchIssuePlace(
  locale: string,
  placeId: number,
): Promise<IssuePlaceRow> {
  const response = await fetch(
    `/api/passport-issue-places/${encodeURIComponent(String(placeId))}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | IssuePlaceDetailResponse
    | { success?: false; message?: string }
    | null;

  if (
    !response.ok ||
    !payload?.success ||
    !("data" in payload) ||
    !payload.data
  ) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to load issuance place",
    );
  }

  const row = mapIssuePlaceToRow(payload.data, locale as AppLocale);
  if (!row) {
    throw new Error("Unable to load issuance place");
  }

  return row;
}

/**
 * Single passport issue place from `GET /admin/passport-issue-places/:id`.
 */
export function useIssuePlace(placeId: number | null, enabled = true) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...issuePlaceKeys.detail(placeId ?? 0), locale],
    queryFn: () => fetchIssuePlace(locale, placeId as number),
    enabled: enabled && placeId != null && Number.isFinite(placeId),
  });
}
