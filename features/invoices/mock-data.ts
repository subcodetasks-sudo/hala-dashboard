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

export const INVOICES: InvoiceRow[] = [
  {
    id: "inv-900101",
    invoiceNumber: "#INV-01",
    orderId: "mock-cmp-900101",
    orderNumber: "#ORD-01",
    employerName: "Abdullah Al-Qahtani",
    employerPhone: "+966 514 111 001",
    workerName: "Yassin Al-Nahrani",
    paidDate: "Friday, 15 January 2026",
    paidTime: "09:20 AM",
    paidAtIso: "2026-01-15",
    paidAtDateTime: "2026-01-15 09:20 AM",
    amount: 250,
    paymentMethod: "online",
    source: "eform",
    contractStatus: "available",
  },
  {
    id: "inv-900102",
    invoiceNumber: "#INV-02",
    orderId: "mock-cmp-900102",
    orderNumber: "#ORD-02",
    employerName: "Sara Al-Mutairi",
    employerPhone: "+966 550 222 033",
    workerName: "Maria Santos",
    paidDate: "Thursday, 14 January 2026",
    paidTime: "02:10 PM",
    paidAtIso: "2026-01-14",
    paidAtDateTime: "2026-01-14 02:10 PM",
    amount: 250,
    paymentMethod: "manual",
    source: "manual",
    contractStatus: "temporarily_unavailable",
  },
  {
    id: "inv-900103",
    invoiceNumber: "#INV-03",
    orderId: "mock-cmp-900103",
    orderNumber: "#ORD-03",
    employerName: "Fahad Alotaibi",
    employerPhone: "+966 530 333 044",
    workerName: "Juan Dela Cruz",
    paidDate: "Wednesday, 13 January 2026",
    paidTime: "11:30 AM",
    paidAtIso: "2026-01-13",
    paidAtDateTime: "2026-01-13 11:30 AM",
    amount: 300,
    paymentMethod: "online",
    source: "eform",
    contractStatus: "available",
  },
  {
    id: "inv-900104",
    invoiceNumber: "#INV-04",
    orderId: "mock-cmp-900104",
    orderNumber: "#ORD-04",
    employerName: "Maha Alharbi",
    employerPhone: "+966 520 444 055",
    workerName: "Ana Reyes",
    paidDate: "Tuesday, 12 January 2026",
    paidTime: "04:45 PM",
    paidAtIso: "2026-01-12",
    paidAtDateTime: "2026-01-12 04:45 PM",
    amount: 250,
    paymentMethod: "manual",
    source: "manual",
    contractStatus: "temporarily_unavailable",
  },
  {
    id: "inv-900105",
    invoiceNumber: "#INV-05",
    orderId: "mock-cmp-900105",
    orderNumber: "#ORD-05",
    employerName: "Turki Al-Dosari",
    employerPhone: "+966 555 555 066",
    workerName: "Pedro Garcia",
    paidDate: "Monday, 11 January 2026",
    paidTime: "10:00 AM",
    paidAtIso: "2026-01-11",
    paidAtDateTime: "2026-01-11 10:00 AM",
    amount: 275,
    paymentMethod: "online",
    source: "eform",
    contractStatus: "available",
  },
  {
    id: "inv-900106",
    invoiceNumber: "#INV-06",
    orderId: "mock-cmp-900106",
    orderNumber: "#ORD-06",
    employerName: "Nasser Al-Ghamdi",
    employerPhone: "+966 540 666 077",
    workerName: "Lisa Mendoza",
    paidDate: "Sunday, 10 January 2026",
    paidTime: "01:40 PM",
    paidAtIso: "2026-01-10",
    paidAtDateTime: "2026-01-10 01:40 PM",
    amount: 250,
    paymentMethod: "manual",
    source: "manual",
    contractStatus: "temporarily_unavailable",
  },
  {
    id: "inv-900107",
    invoiceNumber: "#INV-07",
    orderId: "mock-cmp-900107",
    orderNumber: "#ORD-07",
    employerName: "Reem Al-Shehri",
    employerPhone: "+966 512 777 088",
    workerName: "Carlos Rivera",
    paidDate: "Saturday, 9 January 2026",
    paidTime: "08:15 AM",
    paidAtIso: "2026-01-09",
    paidAtDateTime: "2026-01-09 08:15 AM",
    amount: 320,
    paymentMethod: "online",
    source: "eform",
    contractStatus: "available",
  },
  {
    id: "inv-900108",
    invoiceNumber: "#INV-08",
    orderId: "mock-cmp-900108",
    orderNumber: "#ORD-08",
    employerName: "Omar Al-Harbi",
    employerPhone: "+966 560 888 099",
    workerName: "Sofia Lopez",
    paidDate: "Friday, 8 January 2026",
    paidTime: "03:25 PM",
    paidAtIso: "2026-01-08",
    paidAtDateTime: "2026-01-08 03:25 PM",
    amount: 250,
    paymentMethod: "manual",
    source: "manual",
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
