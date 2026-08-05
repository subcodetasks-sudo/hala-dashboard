"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  LegalPageKind,
  LegalSectionMutationResponse,
} from "@/features/content-management/types";

async function deleteLegalSection(
  locale: string,
  page: LegalPageKind,
  id: number,
): Promise<LegalSectionMutationResponse> {
  const response = await fetch(
    `/api/content-management/legal/${page}/sections/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | LegalSectionMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to delete legal section",
    );
  }

  return payload;
}

export function useDeleteLegalSection(page: LegalPageKind) {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLegalSection(locale, page, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.legalSections(page),
      });
    },
  });
}
