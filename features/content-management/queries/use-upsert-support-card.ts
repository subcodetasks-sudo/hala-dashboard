"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  SupportCardFormValues,
  SupportCardMutationResponse,
  SupportCardNumber,
} from "@/features/content-management/types";
import { buildSupportCardFormData } from "@/features/content-management/utils/build-support-card-form-data";

export type UpsertSupportCardInput = {
  cardNumber: SupportCardNumber;
  values: SupportCardFormValues;
  image?: File;
};

async function upsertSupportCard(
  locale: string,
  input: UpsertSupportCardInput,
): Promise<SupportCardMutationResponse> {
  const response = await fetch(
    "/api/content-management/legal/support/cards",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
      body: buildSupportCardFormData(
        input.cardNumber,
        input.values,
        input.image,
      ),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | SupportCardMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to save support card",
    );
  }

  return payload;
}

export function useUpsertSupportCard() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertSupportCardInput) =>
      upsertSupportCard(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.supportCards(),
      });
    },
  });
}
