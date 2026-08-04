"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { issuePlaceKeys } from "@/features/cities/query-keys";
import type {
  IssuePlaceFormValues,
  IssuePlaceMutationResponse,
} from "@/features/cities/types";
import { orderKeys } from "@/features/orders/query-keys";

export type UpdateIssuePlaceInput = {
  placeId: number;
  values: IssuePlaceFormValues;
};

async function updateIssuePlace(
  locale: string,
  input: UpdateIssuePlaceInput,
): Promise<IssuePlaceMutationResponse> {
  const response = await fetch(
    `/api/passport-issue-places/${encodeURIComponent(String(input.placeId))}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name_ar: input.values.nameAr.trim(),
        name_en: input.values.nameEn.trim(),
        status: input.values.status,
        country: input.values.country,
      }),
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
        : "Unable to update issuance place",
    );
  }

  return payload;
}

export function useUpdateIssuePlace() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateIssuePlaceInput) =>
      updateIssuePlace(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issuePlaceKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
