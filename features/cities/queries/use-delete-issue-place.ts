"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { issuePlaceKeys } from "@/features/cities/query-keys";
import type { IssuePlaceMutationResponse } from "@/features/cities/types";
import { orderKeys } from "@/features/orders/query-keys";

async function deleteIssuePlace(
  locale: string,
  placeId: number,
): Promise<IssuePlaceMutationResponse> {
  const response = await fetch(
    `/api/passport-issue-places/${encodeURIComponent(String(placeId))}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | IssuePlaceMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to delete issuance place",
    );
  }

  return payload;
}

export function useDeleteIssuePlace() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: number) => deleteIssuePlace(locale, placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issuePlaceKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
