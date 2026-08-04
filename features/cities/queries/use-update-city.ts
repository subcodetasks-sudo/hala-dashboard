"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { citiesKeys } from "@/features/cities/query-keys";
import type {
  CityFormValues,
  CityMutationResponse,
} from "@/features/cities/types";
import { orderKeys } from "@/features/orders/query-keys";

export type UpdateCityInput = {
  cityId: number;
  values: CityFormValues;
};

async function updateCity(
  locale: string,
  input: UpdateCityInput,
): Promise<CityMutationResponse> {
  const response = await fetch(
    `/api/cities/${encodeURIComponent(String(input.cityId))}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name_ar: input.values.nameAr.trim(),
        name_en: input.values.nameEn.trim(),
        status: input.values.status,
      }),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | CityMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to update city",
    );
  }

  return payload;
}

/**
 * Updates a city via `PUT /admin/cities/:id` and refreshes list + indicators.
 */
export function useUpdateCity() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCityInput) => updateCity(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citiesKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
