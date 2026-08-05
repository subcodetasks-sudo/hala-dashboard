"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  FaqItemFormValues,
  FaqMutationResponse,
} from "@/features/content-management/types";

export type CreateFaqItemInput = {
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

async function createFaqItem(
  locale: string,
  input: CreateFaqItemInput,
): Promise<FaqMutationResponse> {
  const response = await fetch("/api/content-management/faqs", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildBody(input.values)),
  });

  const payload = (await response.json().catch(() => null)) as
    | FaqMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to create FAQ item",
    );
  }

  return payload;
}

export function useCreateFaqItem() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFaqItemInput) => createFaqItem(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.faqsItems(),
      });
    },
  });
}
