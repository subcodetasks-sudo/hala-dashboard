import type { ProcessedOrdersFilterValues } from "@/features/orders/types";

export const DEFAULT_PROCESSED_ORDERS_FILTERS: ProcessedOrdersFilterValues = {
  fromDate: undefined,
  toDate: undefined,
  expectedExecution: undefined,
  search: "",
  orderType: "all",
};
