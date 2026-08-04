import { useQuery } from "@tanstack/react-query";

import {
  filterTrackingNumbers,
  TRACKING_INDICATORS,
  TRACKING_NUMBERS,
} from "@/features/tracking/mock-data";
import { trackingQueryKeys } from "@/features/tracking/query-keys";
import type { TrackingFilterValues } from "@/features/tracking/types";

export function useTrackingNumbers(filters: TrackingFilterValues) {
  return useQuery({
    queryKey: trackingQueryKeys.list(filters),
    queryFn: async () => {
      // Simulate network request delay if needed
      return filterTrackingNumbers(TRACKING_NUMBERS, filters);
    },
  });
}

export function useTrackingIndicators() {
  return useQuery({
    queryKey: trackingQueryKeys.indicators(),
    queryFn: async () => {
      return TRACKING_INDICATORS;
    },
  });
}
