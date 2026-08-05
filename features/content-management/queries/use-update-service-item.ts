"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  ServiceItemFormValues,
  ServiceMutationResponse,
} from "@/features/content-management/types";

export type UpdateServiceItemInput = {
  id: number;
  values: ServiceItemFormValues;
  image?: File;
};

function buildFormData(
  values: ServiceItemFormValues,
  image?: File,
): FormData {
  const formData = new FormData();
  formData.append("title[ar]", values.titleAr.trim());
  formData.append("title[en]", values.titleEn.trim());
  formData.append("description[ar]", values.descriptionAr.trim());
  formData.append("description[en]", values.descriptionEn.trim());
  formData.append("button_text[ar]", values.buttonTextAr.trim());
  formData.append("button_text[en]", values.buttonTextEn.trim());
  formData.append("button_link", values.buttonLink.trim());
  formData.append("sort_order", values.sortOrder.trim());
  formData.append("status", "active");

  if (image && image.size > 0) {
    formData.append("image", image, image.name);
  }

  return formData;
}

async function updateServiceItem(
  locale: string,
  input: UpdateServiceItemInput,
): Promise<ServiceMutationResponse> {
  const response = await fetch(
    `/api/content-management/services/${encodeURIComponent(String(input.id))}`,
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
    | ServiceMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to update service item",
    );
  }

  return payload;
}

export function useUpdateServiceItem() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateServiceItemInput) =>
      updateServiceItem(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.servicesItems(),
      });
    },
  });
}
