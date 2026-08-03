import type { OrderStatus } from "@/features/orders/types";

/** Message keys under `Orders.New.Review.statuses`. */
export const ORDER_STATUS_LABEL_KEYS = {
  draft: "draft",
  new: "new",
  under_review: "underReview",
  processed: "processed",
  held: "held",
  sent_for_authentication: "sentForAuthentication",
  awaiting_payment: "awaitingPayment",
  completed: "completed",
  cancelled: "cancelled",
} as const satisfies Record<
  OrderStatus,
  | "draft"
  | "new"
  | "underReview"
  | "processed"
  | "held"
  | "sentForAuthentication"
  | "awaitingPayment"
  | "completed"
  | "cancelled"
>;

export type OrderStatusLabelKey =
  (typeof ORDER_STATUS_LABEL_KEYS)[OrderStatus];
