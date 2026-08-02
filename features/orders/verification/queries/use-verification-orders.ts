"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  orderKeys,
  verificationOrderKeys,
} from "@/features/orders/query-keys";
import type {
  VerificationOrderRow,
  VerificationOrdersFilterValues,
} from "@/features/orders/types";
import {
  DEFAULT_VERIFICATION_ORDERS_FILTERS,
  filterVerificationOrders,
  VERIFICATION_ORDERS,
} from "@/features/orders/verification/mock-data";

let verificationOrdersStore: VerificationOrderRow[] = [...VERIFICATION_ORDERS];

export async function fetchVerificationOrders(
  filters: VerificationOrdersFilterValues = DEFAULT_VERIFICATION_ORDERS_FILTERS
): Promise<VerificationOrderRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return filterVerificationOrders(verificationOrdersStore, filters);
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
        queryKey: orderKeys.renewalRequestAuthenticationSentStats(),
      });
    },
  });
}
