import type {
  PaymentOrderRow,
  PaymentOrdersFilterValues,
} from "@/features/orders/types";

export const DEFAULT_PAYMENT_ORDERS_FILTERS: PaymentOrdersFilterValues = {
  createdAt: undefined,
  contractUploadedAt: undefined,
  search: "",
  orderType: "all",
  deliveryStatus: "all",
};

export const PAYMENT_ORDERS: PaymentOrderRow[] = [
  {
    id: "1",
    orderNumber: "#ORD-01",
    employerName: "Abdullah Al-Qahtani",
    employerPhone: "+966 514 111 001",
    workerName: "Yassin Al-Nahrani",
    createdDate: "Tuesday, 12 January 2026",
    createdTime: "10:30 AM",
    createdAtIso: "2026-01-12",
    processedDate: "Wednesday, 13 January 2026",
    processedTime: "02:15 PM",
    processedAtIso: "2026-01-13",
    contractUploadedDate: "Thursday, 14 January 2026",
    contractUploadedTime: "11:00 AM",
    contractUploadedAtIso: "2026-01-14",
    source: "eform",
    dueFees: 250,
    deliveryStatus: "required",
  },
  {
    id: "2",
    orderNumber: "#ORD-02",
    employerName: "Sara Al-Mutairi",
    employerPhone: "+966 550 222 033",
    workerName: "Maria Santos",
    createdDate: "Monday, 11 January 2026",
    createdTime: "09:20 AM",
    createdAtIso: "2026-01-11",
    processedDate: "Tuesday, 12 January 2026",
    processedTime: "01:40 PM",
    processedAtIso: "2026-01-12",
    contractUploadedDate: "Wednesday, 13 January 2026",
    contractUploadedTime: "04:30 PM",
    contractUploadedAtIso: "2026-01-13",
    source: "manual",
    dueFees: 250,
    deliveryStatus: "notRequired",
  },
  {
    id: "3",
    orderNumber: "#ORD-03",
    employerName: "Fahad Alotaibi",
    employerPhone: "+966 530 333 044",
    workerName: "Juan Dela Cruz",
    createdDate: "Sunday, 10 January 2026",
    createdTime: "03:10 PM",
    createdAtIso: "2026-01-10",
    processedDate: "Monday, 11 January 2026",
    processedTime: "10:05 AM",
    processedAtIso: "2026-01-11",
    contractUploadedDate: "Tuesday, 12 January 2026",
    contractUploadedTime: "09:45 AM",
    contractUploadedAtIso: "2026-01-12",
    source: "eform",
    dueFees: 300,
    deliveryStatus: "required",
  },
  {
    id: "4",
    orderNumber: "#ORD-04",
    employerName: "Maha Alharbi",
    employerPhone: "+966 520 444 055",
    workerName: "Ana Reyes",
    createdDate: "Saturday, 9 January 2026",
    createdTime: "01:05 PM",
    createdAtIso: "2026-01-09",
    processedDate: "Sunday, 10 January 2026",
    processedTime: "11:20 AM",
    processedAtIso: "2026-01-10",
    contractUploadedDate: "Monday, 11 January 2026",
    contractUploadedTime: "03:00 PM",
    contractUploadedAtIso: "2026-01-11",
    source: "manual",
    dueFees: 250,
    deliveryStatus: "notRequired",
  },
  {
    id: "5",
    orderNumber: "#ORD-05",
    employerName: "Turki Al-Dosari",
    employerPhone: "+966 555 555 066",
    workerName: "Pedro Garcia",
    createdDate: "Friday, 8 January 2026",
    createdTime: "11:30 AM",
    createdAtIso: "2026-01-08",
    processedDate: "Saturday, 9 January 2026",
    processedTime: "08:50 AM",
    processedAtIso: "2026-01-09",
    contractUploadedDate: "Sunday, 10 January 2026",
    contractUploadedTime: "01:15 PM",
    contractUploadedAtIso: "2026-01-10",
    source: "eform",
    dueFees: 275,
    deliveryStatus: "required",
  },
  {
    id: "6",
    orderNumber: "#ORD-06",
    employerName: "Nasser Al-Ghamdi",
    employerPhone: "+966 540 666 077",
    workerName: "Lisa Mendoza",
    createdDate: "Thursday, 7 January 2026",
    createdTime: "08:50 AM",
    createdAtIso: "2026-01-07",
    processedDate: "Friday, 8 January 2026",
    processedTime: "04:10 PM",
    processedAtIso: "2026-01-08",
    contractUploadedDate: "Saturday, 9 January 2026",
    contractUploadedTime: "10:20 AM",
    contractUploadedAtIso: "2026-01-09",
    source: "manual",
    dueFees: 250,
    deliveryStatus: "required",
  },
  {
    id: "7",
    orderNumber: "#ORD-07",
    employerName: "Reem Al-Shehri",
    employerPhone: "+966 512 777 088",
    workerName: "Carlos Rivera",
    createdDate: "Wednesday, 6 January 2026",
    createdTime: "02:40 PM",
    createdAtIso: "2026-01-06",
    processedDate: "Thursday, 7 January 2026",
    processedTime: "12:00 PM",
    processedAtIso: "2026-01-07",
    contractUploadedDate: "Friday, 8 January 2026",
    contractUploadedTime: "05:45 PM",
    contractUploadedAtIso: "2026-01-08",
    source: "eform",
    dueFees: 320,
    deliveryStatus: "notRequired",
  },
  {
    id: "8",
    orderNumber: "#ORD-08",
    employerName: "Omar Al-Harbi",
    employerPhone: "+966 560 888 099",
    workerName: "Sofia Lopez",
    createdDate: "Tuesday, 5 January 2026",
    createdTime: "04:15 PM",
    createdAtIso: "2026-01-05",
    processedDate: "Wednesday, 6 January 2026",
    processedTime: "09:30 AM",
    processedAtIso: "2026-01-06",
    contractUploadedDate: "Thursday, 7 January 2026",
    contractUploadedTime: "02:00 PM",
    contractUploadedAtIso: "2026-01-07",
    source: "manual",
    dueFees: 250,
    deliveryStatus: "required",
  },
];

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterPaymentOrders(
  orders: PaymentOrderRow[],
  filters: PaymentOrdersFilterValues
): PaymentOrderRow[] {
  const query = filters.search.trim().toLowerCase();
  const createdIso = filters.createdAt
    ? toIsoDate(filters.createdAt)
    : undefined;
  const contractIso = filters.contractUploadedAt
    ? toIsoDate(filters.contractUploadedAt)
    : undefined;

  return orders.filter((order) => {
    if (filters.orderType !== "all" && order.source !== filters.orderType) {
      return false;
    }

    if (
      filters.deliveryStatus !== "all" &&
      order.deliveryStatus !== filters.deliveryStatus
    ) {
      return false;
    }

    if (query) {
      const haystack =
        `${order.orderNumber} ${order.employerName}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (createdIso && order.createdAtIso !== createdIso) return false;
    if (contractIso && order.contractUploadedAtIso !== contractIso) {
      return false;
    }

    return true;
  });
}
