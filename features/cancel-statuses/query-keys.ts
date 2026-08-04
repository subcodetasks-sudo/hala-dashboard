import type { CancelStatusFilterValues } from "@/features/cancel-statuses/types";

export const cancelStatusKeys = {
  all: ["cancel-statuses"] as const,
  indicators: () => [...cancelStatusKeys.all, "indicators"] as const,
  lists: () => [...cancelStatusKeys.all, "list"] as const,
  list: (
    filters: CancelStatusFilterValues,
    page: number,
    perPage: number,
  ) => [...cancelStatusKeys.lists(), { filters, page, perPage }] as const,
  details: () => [...cancelStatusKeys.all, "detail"] as const,
  detail: (id: number) => [...cancelStatusKeys.details(), id] as const,
};
