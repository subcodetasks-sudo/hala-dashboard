"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { cancelStatusKeys } from "@/features/cancel-statuses/query-keys";
import type { CancelStatusMutationResponse } from "@/features/cancel-statuses/types";

async function deleteCancelStatus(
  locale: string,
  id: number,
): Promise<CancelStatusMutationResponse> {
  const response = await fetch(
    `/api/cancel-statuses/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | CancelStatusMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to delete cancel status",
    );
  }

  return payload;
}

export function useDeleteCancelStatus() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCancelStatus(locale, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cancelStatusKeys.all });
    },
  });
}
