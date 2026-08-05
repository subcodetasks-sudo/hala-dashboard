"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  FaqsHeaderFormValues,
  FaqsHeaderMutationResponse,
} from "@/features/content-management/types";

export type UpsertFaqsHeaderInput = {
  values: FaqsHeaderFormValues;
};

async function upsertFaqsHeader(
  locale: string,
  input: UpsertFaqsHeaderInput,
): Promise<FaqsHeaderMutationResponse> {
  const response = await fetch("/api/content-management/faqs/header", {
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
    | FaqsHeaderMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to save FAQs header",
    );
  }

  return payload;
}

export function useUpsertFaqsHeader() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertFaqsHeaderInput) =>
      upsertFaqsHeader(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.faqsHeader(),
      });
    },
  });
}
