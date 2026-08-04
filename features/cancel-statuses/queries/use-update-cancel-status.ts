"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { cancelStatusKeys } from "@/features/cancel-statuses/query-keys";
import type {
  CancelStatusFormValues,
  CancelStatusMutationResponse,
} from "@/features/cancel-statuses/types";

export type UpdateCancelStatusInput = {
  id: number;
  values: CancelStatusFormValues;
};

async function updateCancelStatus(
  locale: string,
  input: UpdateCancelStatusInput,
): Promise<CancelStatusMutationResponse> {
  const response = await fetch(
    `/api/cancel-statuses/${encodeURIComponent(String(input.id))}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text_ar: input.values.textAr.trim(),
        text_en: input.values.textEn.trim(),
        active: input.values.active,
      }),
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
        : "Unable to update cancel status",
    );
  }

  return payload;
}

export function useUpdateCancelStatus() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCancelStatusInput) =>
      updateCancelStatus(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cancelStatusKeys.all });
    },
  });
}
