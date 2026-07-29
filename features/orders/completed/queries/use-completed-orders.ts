"use client";

import { useQuery } from "@tanstack/react-query";

import {
  COMPLETED_ORDERS,
  DEFAULT_COMPLETED_ORDERS_FILTERS,
  filterCompletedOrders,
} from "@/features/orders/completed/mock-data";
import { completedOrderKeys } from "@/features/orders/query-keys";
import type {
  CompletedOrderRow,
  CompletedOrdersFilterValues,
} from "@/features/orders/types";

export type CompletedIndicators = {
  total: number;
  paidOnline: number;
  paidManual: number;
  withDelivery: number;
  pickup: number;
  change: string;
};

const completedOrdersStore: CompletedOrderRow[] = [...COMPLETED_ORDERS];

export async function fetchCompletedOrders(
  filters: CompletedOrdersFilterValues = DEFAULT_COMPLETED_ORDERS_FILTERS
): Promise<CompletedOrderRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return filterCompletedOrders(completedOrdersStore, filters);
}

export async function fetchCompletedIndicators(): Promise<CompletedIndicators> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    total: 156,
    paidOnline: 94,
    paidManual: 64,
    withDelivery: 100,
    pickup: 56,
    change: "+24%",
  };
}

/**
 * Lists completed orders with optional filter criteria.
 */
export function useCompletedOrders(
  filters: CompletedOrdersFilterValues = DEFAULT_COMPLETED_ORDERS_FILTERS
) {
  return useQuery({
    queryKey: completedOrderKeys.list(filters),
    queryFn: () => fetchCompletedOrders(filters),
  });
}

/**
 * Summary indicator cards for the completed orders page.
 */
export function useCompletedIndicators() {
  return useQuery({
    queryKey: completedOrderKeys.indicators(),
    queryFn: fetchCompletedIndicators,
  });
}
