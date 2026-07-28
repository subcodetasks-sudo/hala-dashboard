import type {
  OrdersFilterValues,
  PaymentOrdersFilterValues,
  VerificationOrdersFilterValues,
} from "@/features/orders/types";

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

export const verificationOrderKeys = {
  all: [...orderKeys.all, "verification"] as const,
  lists: () => [...verificationOrderKeys.all, "list"] as const,
  list: (filters?: VerificationOrdersFilterValues) =>
    [...verificationOrderKeys.lists(), { filters }] as const,
  indicators: () => [...verificationOrderKeys.all, "indicators"] as const,
};

export const paymentOrderKeys = {
  all: [...orderKeys.all, "payment"] as const,
  lists: () => [...paymentOrderKeys.all, "list"] as const,
  list: (filters?: PaymentOrdersFilterValues) =>
    [...paymentOrderKeys.lists(), { filters }] as const,
  indicators: () => [...paymentOrderKeys.all, "indicators"] as const,
};
