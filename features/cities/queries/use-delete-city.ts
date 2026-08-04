"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { citiesKeys } from "@/features/cities/query-keys";
import type { CityMutationResponse } from "@/features/cities/types";
import { orderKeys } from "@/features/orders/query-keys";

async function deleteCity(
  locale: string,
  cityId: number,
): Promise<CityMutationResponse> {
  const response = await fetch(
    `/api/cities/${encodeURIComponent(String(cityId))}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
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
        : "Unable to delete city",
    );
  }

  return payload;
}

/**
 * Deletes a city via `DELETE /admin/cities/:id` and refreshes list + indicators.
 */
export function useDeleteCity() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cityId: number) => deleteCity(locale, cityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citiesKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
