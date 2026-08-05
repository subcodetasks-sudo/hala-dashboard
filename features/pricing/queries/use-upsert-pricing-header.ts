"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { pricingKeys } from "@/features/pricing/query-keys";
import type {
  PricingHeaderFormValues,
  PricingHeaderMutationResponse,
} from "@/features/pricing/types";

export type UpsertPricingHeaderInput = {
  values: PricingHeaderFormValues;
};

async function upsertPricingHeader(
  locale: string,
  input: UpsertPricingHeaderInput,
): Promise<PricingHeaderMutationResponse> {
  const response = await fetch("/api/pricing/header", {
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
    | PricingHeaderMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to save pricing header",
    );
  }

  return payload;
}

export function useUpsertPricingHeader() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertPricingHeaderInput) =>
      upsertPricingHeader(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pricingKeys.header(),
      });
    },
  });
}
