"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  InquiryTypeFormValues,
  InquiryTypeMutationResponse,
} from "@/features/content-management/types";

export type UpdateInquiryTypeInput = {
  id: number;
  values: InquiryTypeFormValues;
};

function buildBody(values: InquiryTypeFormValues) {
  return {
    name: {
      ar: values.nameAr.trim(),
      en: values.nameEn.trim(),
    },
    sort_order: Number(values.sortOrder.trim()),
    status: values.status,
  };
}

async function updateInquiryType(
  locale: string,
  input: UpdateInquiryTypeInput,
): Promise<InquiryTypeMutationResponse> {
  const response = await fetch(
    `/api/content-management/legal/support/inquiry-types/${encodeURIComponent(String(input.id))}`,
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
    | InquiryTypeMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to update inquiry type",
    );
  }

  return payload;
}

export function useUpdateInquiryType() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateInquiryTypeInput) =>
      updateInquiryType(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.inquiryTypes(),
      });
    },
  });
}
