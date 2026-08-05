"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  SupportFormHeaderFormValues,
  SupportFormHeaderMutationResponse,
} from "@/features/content-management/types";

export type UpsertSupportFormHeaderInput = {
  values: SupportFormHeaderFormValues;
};

async function upsertSupportFormHeader(
  locale: string,
  input: UpsertSupportFormHeaderInput,
): Promise<SupportFormHeaderMutationResponse> {
  const response = await fetch(
    "/api/content-management/legal/support/form-header",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | SupportFormHeaderMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to save support form header",
    );
  }

  return payload;
}

export function useUpsertSupportFormHeader() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertSupportFormHeaderInput) =>
      upsertSupportFormHeader(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.supportFormHeader(),
      });
    },
  });
}
