"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { pricingKeys } from "@/features/pricing/query-keys";
import type { PackageMutationResponse } from "@/features/pricing/types";

async function deletePackage(
  locale: string,
  id: number,
): Promise<PackageMutationResponse> {
  const response = await fetch(
    `/api/pricing/packages/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
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
        : "Unable to delete package",
    );
  }

  return payload;
}

export function useDeletePackage() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePackage(locale, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pricingKeys.packages(),
      });
    },
  });
}
