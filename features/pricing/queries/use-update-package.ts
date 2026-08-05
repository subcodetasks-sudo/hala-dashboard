"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { pricingKeys } from "@/features/pricing/query-keys";
import type {
  PackageFormValues,
  PackageMutationResponse,
} from "@/features/pricing/types";
import { buildPlanFormData } from "@/features/pricing/utils/map-package-to-row";

export type UpdatePackageInput = {
  id: number;
  values: PackageFormValues;
  icon?: File;
};

async function updatePackage(
  locale: string,
  input: UpdatePackageInput,
): Promise<PackageMutationResponse> {
  const response = await fetch(
    `/api/pricing/packages/${encodeURIComponent(String(input.id))}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
      body: buildPlanFormData(input.values, input.icon),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | PackageMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to update package",
    );
  }

  return payload;
}

export function useUpdatePackage() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePackageInput) => updatePackage(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pricingKeys.packages(),
      });
    },
  });
}
