import type {
  InvoiceRow,
  InvoicesFilterValues,
} from "@/features/invoices/types";
import { COMPLETED_ORDERS } from "@/features/orders/completed/mock-data";
import type { CompletedOrderRow } from "@/features/orders/types";

export const DEFAULT_INVOICES_FILTERS: InvoicesFilterValues = {
  paidAt: undefined,
  search: "",
  orderType: "all",
  paymentMethod: "all",
  contractStatus: "all",
};

/** Map a completed order into an invoice row (shared identity + payment fields). */
function mapCompletedOrderToInvoice(
  order: CompletedOrderRow,
  index: number,
): InvoiceRow {
  const n = String(index + 1).padStart(2, "0");

  return {
    id: `inv-${order.id}`,
    invoiceNumber: `#INV-${n}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    employerName: order.employerName,
    employerPhone: order.employerPhone,
    workerName: order.workerName,
    paidDate: order.paidDate,
    paidTime: order.paidTime,
    paidAtIso: order.paidAtIso,
    paidAtDateTime: `${order.paidAtIso} ${order.paidTime}`,
    amount: order.dueFees,
    paymentMethod: order.paymentMethod,
    source: order.source,
    // Invoice-only field — alternate to keep the filled design variety.
    contractStatus: index % 2 === 0 ? "available" : "temporarily_unavailable",
  };
}

/** Invoices derived from completed orders so list rows stay in sync. */
export const INVOICES: InvoiceRow[] =
  COMPLETED_ORDERS.map(mapCompletedOrderToInvoice);

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterInvoices(
  invoices: InvoiceRow[],
  filters: InvoicesFilterValues,
): InvoiceRow[] {
  const search = filters.search.trim().toLowerCase();
  const paidIso = filters.paidAt ? toIsoDate(filters.paidAt) : undefined;

  return invoices.filter((invoice) => {
    if (filters.orderType !== "all" && invoice.source !== filters.orderType) {
      return false;
    }

    if (
      filters.paymentMethod !== "all" &&
      invoice.paymentMethod !== filters.paymentMethod
    ) {
      return false;
    }

    if (
      filters.contractStatus !== "all" &&
      invoice.contractStatus !== filters.contractStatus
    ) {
      return false;
    }

    if (paidIso && invoice.paidAtIso !== paidIso) {
      return false;
    }

    if (search) {
      const haystack = [
        invoice.invoiceNumber,
        invoice.orderNumber,
        invoice.employerName,
        invoice.employerPhone,
        invoice.workerName,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });
}
