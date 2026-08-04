"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { issuePlaceKeys } from "@/features/cities/query-keys";
import type {
  IssuePlaceFormValues,
  IssuePlaceMutationResponse,
} from "@/features/cities/types";
import { orderKeys } from "@/features/orders/query-keys";

async function createIssuePlace(
  locale: string,
  values: IssuePlaceFormValues,
): Promise<IssuePlaceMutationResponse> {
  const response = await fetch("/api/passport-issue-places", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name_ar: values.nameAr.trim(),
      name_en: values.nameEn.trim(),
      status: values.status,
      country: values.country,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | IssuePlaceMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to create issuance place",
    );
  }

  return payload;
}

export function useCreateIssuePlace() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: IssuePlaceFormValues) =>
      createIssuePlace(locale, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issuePlaceKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
