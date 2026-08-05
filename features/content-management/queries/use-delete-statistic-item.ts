"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type { StatisticMutationResponse } from "@/features/content-management/types";

async function deleteStatisticItem(
  locale: string,
  id: number,
): Promise<StatisticMutationResponse> {
  const response = await fetch(
    `/api/content-management/statistics/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | StatisticMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to delete statistic item",
    );
  }

  return payload;
}

export function useDeleteStatisticItem() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteStatisticItem(locale, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.statisticsItems(),
      });
    },
  });
}
