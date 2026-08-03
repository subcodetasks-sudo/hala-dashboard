"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unpublishContentInStore } from "@/features/content-management/mock-data";
import { contentManagementKeys } from "@/features/content-management/query-keys";
import type { ContentRow } from "@/features/content-management/types";

async function unpublishContent(id: string): Promise<ContentRow> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return unpublishContentInStore(id);
}

/**
 * Unpublishes content (sets status to draft) and refreshes list + indicators.
 */
export function useUnpublishContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unpublishContent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.all,
      });
    },
  });
}
