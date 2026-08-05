"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type { SupportSubmissionMutationResponse } from "@/features/content-management/types";

async function deleteSupportSubmission(
  locale: string,
  id: number,
): Promise<SupportSubmissionMutationResponse> {
  const response = await fetch(
    `/api/content-management/legal/support/submissions/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
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
        : "Unable to delete submission",
    );
  }

  return payload;
}

export function useDeleteSupportSubmission() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSupportSubmission(locale, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.supportSubmissions(),
      });
    },
  });
}
