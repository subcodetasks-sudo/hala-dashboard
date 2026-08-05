"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  StatisticsHeaderFormValues,
  StatisticsHeaderMutationResponse,
} from "@/features/content-management/types";

export type UpsertStatisticsHeaderInput = {
  values: StatisticsHeaderFormValues;
};

async function upsertStatisticsHeader(
  locale: string,
  input: UpsertStatisticsHeaderInput,
): Promise<StatisticsHeaderMutationResponse> {
  const response = await fetch("/api/content-management/statistics/header", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: {
        ar: input.values.contentAr.trim(),
        en: input.values.contentEn.trim(),
      },
      title: {
        ar: input.values.titleAr.trim(),
        en: input.values.titleEn.trim(),
      },
      description: {
        ar: input.values.descriptionAr.trim(),
        en: input.values.descriptionEn.trim(),
      },
      status: "active",
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | StatisticsHeaderMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to save statistics header",
    );
  }

  return payload;
}

export function useUpsertStatisticsHeader() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertStatisticsHeaderInput) =>
      upsertStatisticsHeader(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.statisticsHeader(),
      });
    },
  });
}
