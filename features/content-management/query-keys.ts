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
  hero: () => [...contentManagementKeys.all, "hero"] as const,
  statisticsHeader: () =>
    [...contentManagementKeys.all, "statistics-header"] as const,
  statisticsItems: () =>
    [...contentManagementKeys.all, "statistics-items"] as const,
  statisticsItemsList: (page: number, perPage: number) =>
    [...contentManagementKeys.statisticsItems(), { page, perPage }] as const,
  servicesHeader: () =>
    [...contentManagementKeys.all, "services-header"] as const,
  servicesItems: () =>
    [...contentManagementKeys.all, "services-items"] as const,
  servicesItemsList: (page: number, perPage: number) =>
    [...contentManagementKeys.servicesItems(), { page, perPage }] as const,
  workStepsHeader: () =>
    [...contentManagementKeys.all, "work-steps-header"] as const,
  workStepsItems: () =>
    [...contentManagementKeys.all, "work-steps-items"] as const,
  faqsHeader: () => [...contentManagementKeys.all, "faqs-header"] as const,
  faqsItems: () => [...contentManagementKeys.all, "faqs-items"] as const,
  faqsItemsList: (page: number, perPage: number) =>
    [...contentManagementKeys.faqsItems(), { page, perPage }] as const,
  legalHeader: (page: "terms" | "privacy") =>
    [...contentManagementKeys.all, "legal-header", page] as const,
  legalSections: (page: "terms" | "privacy") =>
    [...contentManagementKeys.all, "legal-sections", page] as const,
  legalSectionsList: (
    page: "terms" | "privacy",
    listPage: number,
    perPage: number,
  ) =>
    [
      ...contentManagementKeys.legalSections(page),
      { page: listPage, perPage },
    ] as const,
};
