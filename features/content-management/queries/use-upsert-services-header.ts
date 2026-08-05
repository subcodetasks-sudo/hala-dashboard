"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  ServicesHeaderFormValues,
  ServicesHeaderMutationResponse,
} from "@/features/content-management/types";

export type UpsertServicesHeaderInput = {
  values: ServicesHeaderFormValues;
};

async function upsertServicesHeader(
  locale: string,
  input: UpsertServicesHeaderInput,
): Promise<ServicesHeaderMutationResponse> {
  const response = await fetch("/api/content-management/services/header", {
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
    | ServicesHeaderMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to save services header",
    );
  }

  return payload;
}

export function useUpsertServicesHeader() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertServicesHeaderInput) =>
      upsertServicesHeader(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.servicesHeader(),
      });
    },
  });
}
