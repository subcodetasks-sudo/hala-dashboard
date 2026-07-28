import type { OrdersFilterValues } from "@/features/orders/types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: OrdersFilterValues) =>
    [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export const newOrderReviewKeys = {
  all: [...orderKeys.all, "new-review"] as const,
  checklists: () => [...newOrderReviewKeys.all, "checklist"] as const,
  checklist: (orderId: string) =>
    [...newOrderReviewKeys.checklists(), orderId] as const,
};
