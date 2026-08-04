import type { CancelStatusFilterValues } from "@/features/cancel-statuses/types";

export const DEFAULT_CANCEL_STATUS_FILTERS: CancelStatusFilterValues = {
  search: "",
  active: "all",
};

export const CANCEL_STATUSES_PER_PAGE = 15;
