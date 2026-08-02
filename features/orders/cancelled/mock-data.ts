import type { CancelledOrdersFilterValues } from "@/features/orders/types";

export const DEFAULT_CANCELLED_ORDERS_FILTERS: CancelledOrdersFilterValues = {
  cancelledAt: undefined,
  search: "",
  orderType: "all",
  cancellationSource: "all",
  cancellationReason: "all",
};
