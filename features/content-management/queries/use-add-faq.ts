"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addFaqToStore } from "@/features/content-management/mock-data";
import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  AddFaqFormValues,
  ContentRow,
} from "@/features/content-management/types";

async function createFaq(values: AddFaqFormValues): Promise<ContentRow> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const now = new Date();
  const row: ContentRow = {
    id: `faq-${now.getTime()}`,
    category: "faqs",
    title: values.question,
    answer: values.answer,
    typeLabel: "FAQ",
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
    displayOrder: values.displayOrder,
  };

  return addFaqToStore(row);
}

/**
 * Creates a FAQ item and refreshes list + indicators.
 */
export function useAddFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.all,
      });
    },
  });
}
