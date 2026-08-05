"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  HeroFormValues,
  HeroMutationResponse,
} from "@/features/content-management/types";

export type UpsertHeroInput = {
  values: HeroFormValues;
  image?: File;
};

async function upsertHero(
  locale: string,
  input: UpsertHeroInput,
): Promise<HeroMutationResponse> {
  const formData = new FormData();
  formData.append("badge[ar]", input.values.badgeAr.trim());
  formData.append("badge[en]", input.values.badgeEn.trim());
  formData.append("title[ar]", input.values.titleAr.trim());
  formData.append("title[en]", input.values.titleEn.trim());
  formData.append("description[ar]", input.values.descriptionAr.trim());
  formData.append("description[en]", input.values.descriptionEn.trim());
  formData.append("status", "active");

  if (input.image && input.image.size > 0) {
    formData.append("image", input.image, input.image.name);
  }

  const response = await fetch("/api/content-management/hero", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as
    | HeroMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to save hero section",
    );
  }

  return payload;
}

export function useUpsertHero() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertHeroInput) => upsertHero(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentManagementKeys.hero() });
    },
  });
}
