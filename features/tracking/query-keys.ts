import type { TrackingFilterValues } from "@/features/tracking/types";

export const trackingQueryKeys = {
  all: ["tracking"] as const,
  lists: () => [...trackingQueryKeys.all, "list"] as const,
  list: (filters: TrackingFilterValues) =>
    [...trackingQueryKeys.lists(), filters] as const,
  indicators: () => [...trackingQueryKeys.all, "indicators"] as const,
};
