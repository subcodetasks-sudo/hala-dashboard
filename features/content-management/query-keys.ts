import type {
  ContentCategory,
  ContentFilterValues,
} from "@/features/content-management/types";

export const contentManagementKeys = {
  all: ["content-management"] as const,
  indicators: (category: ContentCategory) =>
    [...contentManagementKeys.all, "indicators", category] as const,
  lists: () => [...contentManagementKeys.all, "list"] as const,
  list: (category: ContentCategory, filters: ContentFilterValues) =>
    [...contentManagementKeys.lists(), category, { filters }] as const,
};
