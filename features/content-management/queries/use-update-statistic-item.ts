"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  StatisticItemFormValues,
  StatisticMutationResponse,
} from "@/features/content-management/types";

export type UpdateStatisticItemInput = {
  id: number;
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

async function updateStatisticItem(
  locale: string,
  input: UpdateStatisticItemInput,
): Promise<StatisticMutationResponse> {
  const response = await fetch(
    `/api/content-management/statistics/${encodeURIComponent(String(input.id))}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
      body: buildFormData(input.values, input.image),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | StatisticMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to update statistic item",
    );
  }

  return payload;
}

export function useUpdateStatisticItem() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStatisticItemInput) =>
      updateStatisticItem(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.statisticsItems(),
      });
    },
  });
}
