"use client";

import { useQuery } from "@tanstack/react-query";

import { refundOrderKeys } from "@/features/orders/query-keys";
import {
  DEFAULT_REFUND_ORDERS_FILTERS,
  filterRefundOrders,
  REFUND_ORDERS,
} from "@/features/orders/refunds/mock-data";
import type {
  RefundOrderRow,
  RefundOrdersFilterValues,
} from "@/features/orders/types";

export type RefundIndicators = {
  total: number;
  pending: number;
  refunded: number;
  totalAmount: number;
  change: string;
};

const refundOrdersStore: RefundOrderRow[] = [...REFUND_ORDERS];

export async function fetchRefundOrders(
  filters: RefundOrdersFilterValues = DEFAULT_REFUND_ORDERS_FILTERS,
): Promise<RefundOrderRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return filterRefundOrders(refundOrdersStore, filters);
}

export async function fetchRefundIndicators(): Promise<RefundIndicators> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const pending = refundOrdersStore.filter(
    (order) => order.status === "pending",
  ).length;
  const refunded = refundOrdersStore.filter(
    (order) => order.status === "completed",
  ).length;
  const totalAmount = refundOrdersStore
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.refundAmount, 0);

  return {
    total: refundOrdersStore.length,
    pending,
    refunded,
    totalAmount,
    change: "+24%",
  };
}

/**
 * Lists refund orders with optional filter criteria.
 */
export function useRefundOrders(
  filters: RefundOrdersFilterValues = DEFAULT_REFUND_ORDERS_FILTERS,
) {
  return useQuery({
    queryKey: refundOrderKeys.list(filters),
    queryFn: () => fetchRefundOrders(filters),
  });
}

/**
 * Summary indicator cards for the refund orders page.
 */
export function useRefundIndicators() {
  return useQuery({
    queryKey: refundOrderKeys.indicators(),
    queryFn: fetchRefundIndicators,
  });
}
