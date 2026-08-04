"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { cancelStatusKeys } from "@/features/cancel-statuses/query-keys";
import type {
  CancelStatusDetailResponse,
  CancelStatusRow,
} from "@/features/cancel-statuses/types";
import { mapCancelStatusToRow } from "@/features/cancel-statuses/utils/map-cancel-status-to-row";
import type { AppLocale } from "@/features/orders/utils/format-datetime";

async function fetchCancelStatus(
  locale: string,
  id: number,
): Promise<CancelStatusRow> {
  const response = await fetch(
    `/api/cancel-statuses/${encodeURIComponent(String(id))}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | CancelStatusDetailResponse
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
        : "Unable to load cancel status",
    );
  }

  const row = mapCancelStatusToRow(payload.data, locale as AppLocale);
  if (!row) {
    throw new Error("Unable to load cancel status");
  }

  return row;
}

export function useCancelStatus(id: number | null, enabled = true) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...cancelStatusKeys.detail(id ?? 0), locale],
    queryFn: () => fetchCancelStatus(locale, id as number),
    enabled: enabled && id != null && Number.isFinite(id),
  });
}
