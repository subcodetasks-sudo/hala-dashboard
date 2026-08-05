import type {
  BlogFilterValues,
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
  legalHeader: (page: "terms" | "privacy" | "support") =>
    [...contentManagementKeys.all, "legal-header", page] as const,
  legalSections: (page: "terms" | "privacy" | "support") =>
    [...contentManagementKeys.all, "legal-sections", page] as const,
  legalSectionsList: (
    page: "terms" | "privacy" | "support",
    listPage: number,
    perPage: number,
  ) =>
    [
      ...contentManagementKeys.legalSections(page),
      { page: listPage, perPage },
    ] as const,
  supportFormHeader: () =>
    [...contentManagementKeys.all, "support-form-header"] as const,
  supportCards: () =>
    [...contentManagementKeys.all, "support-cards"] as const,
  inquiryTypes: () =>
    [...contentManagementKeys.all, "inquiry-types"] as const,
  inquiryTypesList: (page: number, perPage: number) =>
    [...contentManagementKeys.inquiryTypes(), { page, perPage }] as const,
  supportSubmissions: () =>
    [...contentManagementKeys.all, "support-submissions"] as const,
  supportSubmissionsList: (page: number, perPage: number) =>
    [
      ...contentManagementKeys.supportSubmissions(),
      { page, perPage },
    ] as const,
  blogs: () => [...contentManagementKeys.all, "blogs"] as const,
  blogsList: (page: number, perPage: number, filters: BlogFilterValues) =>
    [...contentManagementKeys.blogs(), { page, perPage, filters }] as const,
};
