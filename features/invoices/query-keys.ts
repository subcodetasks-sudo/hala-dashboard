import type { InvoicesFilterValues } from "@/features/invoices/types";

export const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  list: (filters?: InvoicesFilterValues) =>
    [...invoiceKeys.lists(), { filters }] as const,
  indicators: () => [...invoiceKeys.all, "indicators"] as const,
};
