import type {
  CitiesListFilters,
  CompletedOrdersFilterValues,
  OrdersFilterValues,
  PassportIssuePlacesListFilters,
  RefundOrdersFilterValues,
  RenewalRequestsFilters,
  VerificationOrdersFilterValues,
} from "@/features/orders/types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: OrdersFilterValues | RenewalRequestsFilters) =>
    [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  holdReasons: () => [...orderKeys.all, "hold-reasons"] as const,
  cancellationReasons: () => [...orderKeys.all, "cancellation-reasons"] as const,
  cancellationSources: () => [...orderKeys.all, "cancellation-sources"] as const,
  statuses: () => [...orderKeys.all, "statuses"] as const,
  cities: (filters?: CitiesListFilters) =>
    [...orderKeys.all, "cities", { filters }] as const,
  passportIssuePlaces: (filters?: PassportIssuePlacesListFilters) =>
    [...orderKeys.all, "passport-issue-places", { filters }] as const,
  renewalRequestStats: () => [...orderKeys.all, "renewal-request-stats"] as const,
  renewalRequestHeldStats: () => [...orderKeys.all, "renewal-request-held-stats"] as const,
  renewalRequestProcessedStats: () => [...orderKeys.all, "renewal-request-processed-stats"] as const,
  renewalRequestAuthenticationSentStats: () =>
    [...orderKeys.all, "renewal-request-authentication-sent-stats"] as const,
  renewalRequestPaymentStats: () =>
    [...orderKeys.all, "renewal-request-payment-stats"] as const,
  renewalRequestCompletedStats: () =>
    [...orderKeys.all, "renewal-request-completed-stats"] as const,
  renewalRequestCancelledStats: () =>
    [...orderKeys.all, "renewal-request-cancelled-stats"] as const,
  renewalRequestRefundStats: () =>
    [...orderKeys.all, "renewal-request-refund-stats"] as const,
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

export const completedOrderKeys = {
  all: [...orderKeys.all, "completed"] as const,
  lists: () => [...completedOrderKeys.all, "list"] as const,
  list: (filters?: CompletedOrdersFilterValues) =>
    [...completedOrderKeys.lists(), { filters }] as const,
  indicators: () => [...completedOrderKeys.all, "indicators"] as const,
};

export const refundOrderKeys = {
  all: [...orderKeys.all, "refunds"] as const,
  lists: () => [...refundOrderKeys.all, "list"] as const,
  list: (filters?: RefundOrdersFilterValues) =>
    [...refundOrderKeys.lists(), { filters }] as const,
  indicators: () => [...refundOrderKeys.all, "indicators"] as const,
};
