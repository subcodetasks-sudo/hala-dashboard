import type { OrderReviewDetail } from "@/features/orders/types";

const orderDetailsStore: Record<string, OrderReviewDetail> = {};

function ensureOrderDetail(id: string): OrderReviewDetail {
  if (orderDetailsStore[id]) {
    return orderDetailsStore[id];
  }
  throw new Error(`Order detail with ID ${id} not loaded`);
}

/**
 * Seeds the in-memory detail store (e.g. from server-rendered initial data)
 * so employer/worker edits can update the cache before a client refetch.
 */
export function seedOrderDetail(order: OrderReviewDetail) {
  orderDetailsStore[order.id] = order;
}

export function getSeededOrderDetail(id: string): OrderReviewDetail | undefined {
  return orderDetailsStore[id];
}

export async function updateOrderReviewDetail(
  id: string,
  updates: Partial<OrderReviewDetail>,
): Promise<OrderReviewDetail> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const current = ensureOrderDetail(id);
  const updated = { ...current, ...updates };
  orderDetailsStore[id] = updated;
  return updated;
}

export function setSeededOrderDetail(id: string, detail: OrderReviewDetail) {
  orderDetailsStore[id] = detail;
}
