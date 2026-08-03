"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addBannerToStore } from "@/features/content-management/mock-data";
import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  AddBannerFormValues,
  ContentRow,
} from "@/features/content-management/types";

async function createBanner(
  values: AddBannerFormValues
): Promise<ContentRow> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const now = new Date();
  const row: ContentRow = {
    id: `banner-${now.getTime()}`,
    category: "banners",
    title: values.title,
    alertText: values.alertText,
    alertType: values.alertType,
    startDate: values.startDate,
    endDate: values.endDate,
    typeLabel: "Banner",
    updatedDate: now.toLocaleDateString("ar-SA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    updatedTime: now.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    updatedAtIso: now.toISOString().slice(0, 10),
    appearance: values.appearance,
    author: "systemAdmin",
    status: values.status,
  };

  return addBannerToStore(row);
}

/**
 * Creates a banner/alert and refreshes list + indicators.
 */
export function useAddBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.all,
      });
    },
  });
}
