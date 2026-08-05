"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type { InquiryTypeMutationResponse } from "@/features/content-management/types";

async function deleteInquiryType(
  locale: string,
  id: number,
): Promise<InquiryTypeMutationResponse> {
  const response = await fetch(
    `/api/content-management/legal/support/inquiry-types/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
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
        : "Unable to delete inquiry type",
    );
  }

  return payload;
}

export function useDeleteInquiryType() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteInquiryType(locale, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.inquiryTypes(),
      });
    },
  });
}
