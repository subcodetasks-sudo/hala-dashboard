"use client";

import { useQuery } from "@tanstack/react-query";

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

let verificationOrdersStore: VerificationOrderRow[] = [...VERIFICATION_ORDERS];

export async function fetchVerificationOrders(
  filters: VerificationOrdersFilterValues = DEFAULT_VERIFICATION_ORDERS_FILTERS
): Promise<VerificationOrderRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return filterVerificationOrders(verificationOrdersStore, filters);
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
