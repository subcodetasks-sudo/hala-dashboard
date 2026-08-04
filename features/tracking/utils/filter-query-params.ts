import type { TrackingFilterValues } from "@/features/tracking/types";
import { parseIsoDateParam, toIsoDate } from "@/lib/iso-date";

const TRACKING_FILTER_PARAM_KEYS = {
  usageDate: "usageDate",
  search: "search",
  status: "status",
  shippingCompany: "shippingCompany",
} as const;

export function serializeTrackingFilters(
  filters: TrackingFilterValues,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.usageDate) {
    params.set(
      TRACKING_FILTER_PARAM_KEYS.usageDate,
      toIsoDate(filters.usageDate),
    );
  }

  const search = filters.search.trim();
  if (search) {
    params.set(TRACKING_FILTER_PARAM_KEYS.search, search);
  }

  if (filters.status !== "all") {
    params.set(TRACKING_FILTER_PARAM_KEYS.status, filters.status);
  }

  if (filters.shippingCompany !== "all") {
    params.set(
      TRACKING_FILTER_PARAM_KEYS.shippingCompany,
      filters.shippingCompany,
    );
  }

  return params;
}

export function parseTrackingFilters(
  params: URLSearchParams,
  defaults: TrackingFilterValues,
): TrackingFilterValues {
  return {
    usageDate:
      parseIsoDateParam(params.get(TRACKING_FILTER_PARAM_KEYS.usageDate)) ??
      defaults.usageDate,
    search:
      params.get(TRACKING_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    status: params.get(TRACKING_FILTER_PARAM_KEYS.status) ?? defaults.status,
    shippingCompany:
      params.get(TRACKING_FILTER_PARAM_KEYS.shippingCompany) ??
      defaults.shippingCompany,
  };
}
