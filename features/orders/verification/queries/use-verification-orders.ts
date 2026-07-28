"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { verificationOrderKeys } from "@/features/orders/query-keys";
import type {
  VerificationOrderRow,
  VerificationOrdersFilterValues,
} from "@/features/orders/types";
import {
  DEFAULT_VERIFICATION_ORDERS_FILTERS,
  filterVerificationOrders,
  VERIFICATION_ORDERS,
} from "@/features/orders/verification/mock-data";

export type VerificationIndicators = {
  total: number;
  awaitingContract: number;
  uploadedToday: number;
  change: string;
};

let verificationOrdersStore: VerificationOrderRow[] = [...VERIFICATION_ORDERS];

export async function fetchVerificationOrders(
  filters: VerificationOrdersFilterValues = DEFAULT_VERIFICATION_ORDERS_FILTERS
): Promise<VerificationOrderRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return filterVerificationOrders(verificationOrdersStore, filters);
}

export async function fetchVerificationIndicators(): Promise<VerificationIndicators> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    total: verificationOrdersStore.length,
    awaitingContract: verificationOrdersStore.filter(
      (order) => order.status === "sentForVerification"
    ).length,
    uploadedToday: verificationOrdersStore.filter(
      (order) => order.status === "finalContractUploaded"
    ).length,
    change: "+24%",
  };
}

export async function markFinalContractUploaded(
  id: string
): Promise<VerificationOrderRow> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let updated: VerificationOrderRow | undefined;
  verificationOrdersStore = verificationOrdersStore.map((order) => {
    if (order.id !== id) return order;
    updated = { ...order, status: "finalContractUploaded" };
    return updated;
  });
  if (!updated) {
    throw new Error(`Verification order with ID ${id} not found`);
  }
  return updated;
}

/**
 * Lists verification orders with optional filter criteria.
 */
export function useVerificationOrders(
  filters: VerificationOrdersFilterValues = DEFAULT_VERIFICATION_ORDERS_FILTERS
) {
  return useQuery({
    queryKey: verificationOrderKeys.list(filters),
    queryFn: () => fetchVerificationOrders(filters),
  });
}

/**
 * Summary indicator cards for the verification page.
 */
export function useVerificationIndicators() {
  return useQuery({
    queryKey: verificationOrderKeys.indicators(),
    queryFn: fetchVerificationIndicators,
  });
}

/**
 * Marks an order as having its final contract uploaded.
 */
export function useMarkFinalContractUploaded() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markFinalContractUploaded,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: verificationOrderKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: verificationOrderKeys.indicators(),
      });
    },
  });
}
