"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { pricingKeys } from "@/features/pricing/query-keys";
import type {
  PackageFormValues,
  PackageMutationResponse,
} from "@/features/pricing/types";
import { buildPlanFormData } from "@/features/pricing/utils/map-package-to-row";

export type CreatePackageInput = {
  values: PackageFormValues;
  icon?: File;
};

async function createPackage(
  locale: string,
  input: CreatePackageInput,
): Promise<PackageMutationResponse> {
  const response = await fetch("/api/pricing/packages", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    body: buildPlanFormData(input.values, input.icon),
  });

  const payload = (await response.json().catch(() => null)) as
    | PackageMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to create package",
    );
  }

  return payload;
}

export function useCreatePackage() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePackageInput) => createPackage(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pricingKeys.packages(),
      });
    },
  });
}
