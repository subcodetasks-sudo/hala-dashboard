import type { PendingOrdersFilterValues } from "@/features/orders/types";

export const DEFAULT_PENDING_ORDERS_FILTERS: PendingOrdersFilterValues = {
  fromDate: undefined,
  toDate: undefined,
  search: "",
  suspensionReason: "all",
};
