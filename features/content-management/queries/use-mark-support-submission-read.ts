"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type { SupportSubmissionMutationResponse } from "@/features/content-management/types";

async function markSupportSubmissionRead(
  locale: string,
  id: number,
): Promise<SupportSubmissionMutationResponse> {
  const response = await fetch(
    `/api/content-management/legal/support/submissions/${encodeURIComponent(String(id))}/read`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | SupportSubmissionMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to mark submission as read",
    );
  }

  return payload;
}

export function useMarkSupportSubmissionRead() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markSupportSubmissionRead(locale, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.supportSubmissions(),
      });
    },
  });
}
