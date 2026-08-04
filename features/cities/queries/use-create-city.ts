"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { citiesKeys } from "@/features/cities/query-keys";
import type {
  CityFormValues,
  CityMutationResponse,
} from "@/features/cities/types";
import { orderKeys } from "@/features/orders/query-keys";

async function createCity(
  locale: string,
  values: CityFormValues,
): Promise<CityMutationResponse> {
  const response = await fetch("/api/cities", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name_ar: values.nameAr.trim(),
      name_en: values.nameEn.trim(),
      status: values.status,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | CityMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to create city",
    );
  }

  return payload;
}

/**
 * Creates a city via `POST /admin/cities` and refreshes list + indicators.
 */
export function useCreateCity() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CityFormValues) => createCity(locale, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citiesKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
