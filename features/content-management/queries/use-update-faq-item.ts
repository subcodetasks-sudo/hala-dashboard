"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  FaqItemFormValues,
  FaqMutationResponse,
} from "@/features/content-management/types";

export type UpdateFaqItemInput = {
  id: number;
  values: FaqItemFormValues;
};

function buildBody(values: FaqItemFormValues) {
  return {
    question: {
      ar: values.questionAr.trim(),
      en: values.questionEn.trim(),
    },
    answer: {
      ar: values.answerAr.trim(),
      en: values.answerEn.trim(),
    },
    sort_order: Number(values.sortOrder.trim()),
    status: "active",
  };
}

async function updateFaqItem(
  locale: string,
  input: UpdateFaqItemInput,
): Promise<FaqMutationResponse> {
  const response = await fetch(
    `/api/content-management/faqs/${encodeURIComponent(String(input.id))}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildBody(input.values)),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | FaqMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to update FAQ item",
    );
  }

  return payload;
}

export function useUpdateFaqItem() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateFaqItemInput) => updateFaqItem(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.faqsItems(),
      });
    },
  });
}
