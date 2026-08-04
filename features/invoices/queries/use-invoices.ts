"use client";

import { useQuery } from "@tanstack/react-query";

import {
  DEFAULT_INVOICES_FILTERS,
  filterInvoices,
  INVOICES,
} from "@/features/invoices/mock-data";
import { invoiceKeys } from "@/features/invoices/query-keys";
import type {
  InvoiceRow,
  InvoicesFilterValues,
} from "@/features/invoices/types";

export type InvoiceIndicators = {
  total: number;
  totalAmount: number;
  online: number;
  manual: number;
  change: string;
};

const invoicesStore: InvoiceRow[] = [...INVOICES];

export async function fetchInvoices(
  filters: InvoicesFilterValues = DEFAULT_INVOICES_FILTERS,
): Promise<InvoiceRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return filterInvoices(invoicesStore, filters);
}

export async function fetchInvoiceIndicators(): Promise<InvoiceIndicators> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const totalAmount = invoicesStore.reduce((sum, row) => sum + row.amount, 0);
  const online = invoicesStore.filter((row) => row.paymentMethod === "online")
    .length;
  const manual = invoicesStore.filter((row) => row.paymentMethod === "manual")
    .length;

  return {
    total: invoicesStore.length,
    totalAmount,
    online,
    manual,
    change: "+24%",
  };
}

/**
 * Lists invoices with optional filter criteria.
 */
export function useInvoices(
  filters: InvoicesFilterValues = DEFAULT_INVOICES_FILTERS,
) {
  return useQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: () => fetchInvoices(filters),
  });
}

/**
 * Summary indicator cards for the invoices page.
 */
export function useInvoiceIndicators() {
  return useQuery({
    queryKey: invoiceKeys.indicators(),
    queryFn: fetchInvoiceIndicators,
  });
}
