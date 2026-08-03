import type {
  InvoiceRow,
  InvoicesFilterValues,
} from "@/features/invoices/types";

export const DEFAULT_INVOICES_FILTERS: InvoicesFilterValues = {
  paidAt: undefined,
  search: "",
  orderType: "all",
  paymentMethod: "all",
  contractStatus: "all",
};

const BASE_INVOICE = {
  invoiceNumber: "#ORD-01",
  orderNumber: "ONT-2026-1248",
  employerName: "عبد الله القحطاني",
  employerPhone: "+966 514 111001",
  workerName: "ياسين الدهراني",
  paidDate: "Tuesday, 12 January 2026",
  paidTime: "10:30 AM",
  paidAtIso: "2026-01-12",
  paidAtDateTime: "2026-01-12 10:30:00",
  amount: 250,
} as const;

/** Alternating payment method + contract status to match the filled design. */
export const INVOICES: InvoiceRow[] = [
  {
    id: "inv-mock-01",
    orderId: "order-mock-01",
    ...BASE_INVOICE,
    source: "eform",
    paymentMethod: "manual",
    contractStatus: "available",
  },
  {
    id: "inv-mock-02",
    orderId: "order-mock-02",
    ...BASE_INVOICE,
    source: "manual",
    paymentMethod: "online",
    contractStatus: "temporarily_unavailable",
  },
  {
    id: "inv-mock-03",
    orderId: "order-mock-03",
    ...BASE_INVOICE,
    source: "eform",
    paymentMethod: "manual",
    contractStatus: "available",
  },
  {
    id: "inv-mock-04",
    orderId: "order-mock-04",
    ...BASE_INVOICE,
    source: "manual",
    paymentMethod: "online",
    contractStatus: "temporarily_unavailable",
  },
  {
    id: "inv-mock-05",
    orderId: "order-mock-05",
    ...BASE_INVOICE,
    source: "eform",
    paymentMethod: "manual",
    contractStatus: "available",
  },
  {
    id: "inv-mock-06",
    orderId: "order-mock-06",
    ...BASE_INVOICE,
    source: "manual",
    paymentMethod: "online",
    contractStatus: "temporarily_unavailable",
  },
  {
    id: "inv-mock-07",
    orderId: "order-mock-07",
    ...BASE_INVOICE,
    source: "eform",
    paymentMethod: "manual",
    contractStatus: "available",
  },
  {
    id: "inv-mock-08",
    orderId: "order-mock-08",
    ...BASE_INVOICE,
    source: "manual",
    paymentMethod: "online",
    contractStatus: "temporarily_unavailable",
  },
];

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
