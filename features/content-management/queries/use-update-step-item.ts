"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  StepItemFormValues,
  StepMutationResponse,
} from "@/features/content-management/types";

export type UpdateStepItemInput = {
  id: number;
  values: StepItemFormValues;
  image?: File;
};

function buildFormData(values: StepItemFormValues, image?: File): FormData {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("step_number", values.stepNumber.trim());
  formData.append("step_name[ar]", values.stepNameAr.trim());
  formData.append("step_name[en]", values.stepNameEn.trim());
  formData.append("title[ar]", values.titleAr.trim());
  formData.append("title[en]", values.titleEn.trim());
  formData.append("description[ar]", values.descriptionAr.trim());
  formData.append("description[en]", values.descriptionEn.trim());
  formData.append("status", "active");

  if (image && image.size > 0) {
    formData.append("image", image, image.name);
  }

  return formData;
}

async function updateStepItem(
  locale: string,
  input: UpdateStepItemInput,
): Promise<StepMutationResponse> {
  const response = await fetch(
    `/api/content-management/work-steps/${encodeURIComponent(String(input.id))}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
      body: buildFormData(input.values, input.image),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | StepMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to update step item",
    );
  }

  return payload;
}

export function useUpdateStepItem() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStepItemInput) => updateStepItem(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.workStepsItems(),
      });
    },
  });
}
