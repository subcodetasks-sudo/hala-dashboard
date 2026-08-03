"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import {
  DEFAULT_CONTENT_FILTERS,
  filterContentRows,
  getContentRowsStore,
} from "@/features/content-management/mock-data";
import { contentManagementKeys } from "@/features/content-management/query-keys";
import { useFaqsList } from "@/features/content-management/queries/use-faqs-list";
import type {
  ContentCategory,
  ContentFilterValues,
  ContentRow,
} from "@/features/content-management/types";

async function fetchMockContentList(
  category: ContentCategory,
  filters: ContentFilterValues
): Promise<ContentRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return filterContentRows(getContentRowsStore(), category, filters);
}

/**
 * Content rows for the active category with applied filters.
 * FAQs load from the API; other categories still use the mock store.
 */
export function useContentList(
  category: ContentCategory,
  filters: ContentFilterValues = DEFAULT_CONTENT_FILTERS
) {
  const locale = useLocale();
  const isFaqs = category === "faqs";

  const faqsQuery = useFaqsList(filters, isFaqs);

  const mockQuery = useQuery({
    queryKey: [...contentManagementKeys.list(category, filters), locale],
    queryFn: () => fetchMockContentList(category, filters),
    enabled: !isFaqs,
  });

  if (isFaqs) {
    return faqsQuery;
  }

  return mockQuery;
}
