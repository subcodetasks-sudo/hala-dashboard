"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { paymentOrderKeys } from "@/features/orders/query-keys";
import type {
  PaymentOrderRow,
  PaymentOrdersFilterValues,
} from "@/features/orders/types";
import {
  DEFAULT_PAYMENT_ORDERS_FILTERS,
  filterPaymentOrders,
  PAYMENT_ORDERS,
} from "@/features/orders/payment/mock-data";

export type PaymentIndicators = {
  paidToday: number;
  awaitingConfirmation: number;
  change: string;
};

let paymentOrdersStore: PaymentOrderRow[] = [...PAYMENT_ORDERS];
let paidTodayCount = 5;

export async function fetchPaymentOrders(
  filters: PaymentOrdersFilterValues = DEFAULT_PAYMENT_ORDERS_FILTERS
): Promise<PaymentOrderRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return filterPaymentOrders(paymentOrdersStore, filters);
}

export async function fetchPaymentIndicators(): Promise<PaymentIndicators> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    paidToday: paidTodayCount,
    awaitingConfirmation: paymentOrdersStore.length,
    change: "+24%",
  };
}

export async function confirmPayment(id: string): Promise<PaymentOrderRow> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const order = paymentOrdersStore.find((item) => item.id === id);
  if (!order) {
    throw new Error(`Payment order with ID ${id} not found`);
  }
  paymentOrdersStore = paymentOrdersStore.filter((item) => item.id !== id);
  paidTodayCount += 1;
  return order;
}

/**
 * Lists payment-stage orders with optional filter criteria.
 */
export function usePaymentOrders(
  filters: PaymentOrdersFilterValues = DEFAULT_PAYMENT_ORDERS_FILTERS
) {
  return useQuery({
    queryKey: paymentOrderKeys.list(filters),
    queryFn: () => fetchPaymentOrders(filters),
  });
}

/**
 * Summary indicator cards for the payment page.
 */
export function usePaymentIndicators() {
  return useQuery({
    queryKey: paymentOrderKeys.indicators(),
    queryFn: fetchPaymentIndicators,
  });
}

/**
 * Confirms payment for an order and removes it from the payment list.
 */
export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paymentOrderKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: paymentOrderKeys.indicators(),
      });
    },
  });
}
