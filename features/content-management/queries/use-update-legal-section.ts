"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  LegalPageKind,
  LegalSectionFormValues,
  LegalSectionMutationResponse,
} from "@/features/content-management/types";

export type UpdateLegalSectionInput = {
  id: number;
  values: LegalSectionFormValues;
};

async function updateLegalSection(
  locale: string,
  page: LegalPageKind,
  input: UpdateLegalSectionInput,
): Promise<LegalSectionMutationResponse> {
  const response = await fetch(
    `/api/content-management/legal/${page}/sections/${input.id}`,
    {
      method: "PUT",
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
        content: {
          ar: input.values.contentAr.trim(),
          en: input.values.contentEn.trim(),
        },
        description: {
          ar: input.values.descriptionAr.trim(),
          en: input.values.descriptionEn.trim(),
        },
        sort_order: Number(input.values.sortOrder.trim()),
        status: "active",
      }),
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
        : "Unable to update legal section",
    );
  }

  return payload;
}

export function useUpdateLegalSection(page: LegalPageKind) {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateLegalSectionInput) =>
      updateLegalSection(locale, page, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.legalSections(page),
      });
    },
  });
}
