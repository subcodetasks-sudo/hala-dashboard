"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  WorkStepsHeaderFormValues,
  WorkStepsHeaderMutationResponse,
} from "@/features/content-management/types";

export type UpsertWorkStepsHeaderInput = {
  values: WorkStepsHeaderFormValues;
};

async function upsertWorkStepsHeader(
  locale: string,
  input: UpsertWorkStepsHeaderInput,
): Promise<WorkStepsHeaderMutationResponse> {
  const response = await fetch("/api/content-management/work-steps/header", {
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
    | WorkStepsHeaderMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to save work steps header",
    );
  }

  return payload;
}

export function useUpsertWorkStepsHeader() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertWorkStepsHeaderInput) =>
      upsertWorkStepsHeader(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.workStepsHeader(),
      });
    },
  });
}
