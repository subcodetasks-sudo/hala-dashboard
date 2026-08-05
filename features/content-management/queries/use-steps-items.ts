"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  StepsItemsListResult,
  StepsListResponse,
} from "@/features/content-management/types";
import { mapStepToRow } from "@/features/content-management/utils/map-step-to-row";
import { extractCollection } from "@/lib/api-payload";
import type { AppLocale } from "@/lib/format-datetime";

async function fetchStepsItems(locale: string): Promise<StepsItemsListResult> {
  const response = await fetch("/api/content-management/work-steps", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | StepsListResponse
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
        : "Failed to load work steps",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry) => mapStepToRow(entry, locale as AppLocale))
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => a.stepNumber - b.stepNumber);

  return { items };
}

export function useStepsItems() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.workStepsItems(), locale],
    queryFn: () => fetchStepsItems(locale),
  });
}
