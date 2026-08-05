"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  StatisticItemFormValues,
  StatisticMutationResponse,
} from "@/features/content-management/types";

export type CreateStatisticItemInput = {
  values: StatisticItemFormValues;
  image?: File;
};

function buildFormData(
  values: StatisticItemFormValues,
  image?: File,
): FormData {
  const formData = new FormData();
  formData.append("description[ar]", values.descriptionAr.trim());
  formData.append("description[en]", values.descriptionEn.trim());
  formData.append("number", values.number.trim());
  formData.append("sort_order", values.sortOrder.trim());
  formData.append("status", "active");

  if (image && image.size > 0) {
    formData.append("image", image, image.name);
  }

  return formData;
}

async function createStatisticItem(
  locale: string,
  input: CreateStatisticItemInput,
): Promise<StatisticMutationResponse> {
  const response = await fetch("/api/content-management/statistics", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    body: buildFormData(input.values, input.image),
  });

  const payload = (await response.json().catch(() => null)) as
    | StatisticMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to create statistic item",
    );
  }

  return payload;
}

export function useCreateStatisticItem() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateStatisticItemInput) =>
      createStatisticItem(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.statisticsItems(),
      });
    },
  });
}
