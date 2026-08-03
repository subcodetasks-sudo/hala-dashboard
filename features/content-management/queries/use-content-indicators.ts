"use client";

import { useQuery } from "@tanstack/react-query";

import { getIndicatorsForCategory } from "@/features/content-management/mock-data";
import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  ContentCategory,
  ContentIndicators,
} from "@/features/content-management/types";

async function fetchContentIndicators(
  category: ContentCategory
): Promise<ContentIndicators> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return getIndicatorsForCategory(category);
}

/**
 * Stats for the currently active content category.
 */
export function useContentIndicators(category: ContentCategory) {
  return useQuery({
    queryKey: contentManagementKeys.indicators(category),
    queryFn: () => fetchContentIndicators(category),
  });
}
