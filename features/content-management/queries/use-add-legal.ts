"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addLegalToStore } from "@/features/content-management/mock-data";
import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  AddLegalFormValues,
  ContentRow,
} from "@/features/content-management/types";

async function createLegalPage(
  values: AddLegalFormValues
): Promise<ContentRow> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const now = new Date();
  const row: ContentRow = {
    id: `legal-${now.getTime()}`,
    category: "legal",
    title: values.pageName,
    content: values.content,
    typeLabel: "Legal",
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
    appearance: "legalPage",
    author: "systemAdmin",
    status: values.status,
  };

  return addLegalToStore(row);
}

/**
 * Creates a legal page and refreshes list + indicators.
 */
export function useAddLegal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLegalPage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.all,
      });
    },
  });
}
