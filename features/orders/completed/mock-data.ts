import type {
  CompletedOrderRow,
  CompletedOrdersFilterValues,
} from "@/features/orders/types";

export const DEFAULT_COMPLETED_ORDERS_FILTERS: CompletedOrdersFilterValues = {
  fromDate: undefined,
  toDate: undefined,
  search: "",
  orderType: "all",
  paymentMethod: "all",
  deliveryStatus: "all",
};

export const COMPLETED_ORDERS: CompletedOrderRow[] = [
  {
    id: "mock-cmp-900101",
    orderNumber: "#ORD-01",
    employerName: "Abdullah Al-Qahtani",
    employerPhone: "+966 514 111 001",
    workerName: "Yassin Al-Nahrani",
    createdDate: "Tuesday, 12 January 2026",
    createdTime: "10:30 AM",
    createdAtIso: "2026-01-12",
    contractUploadedDate: "Thursday, 14 January 2026",
    contractUploadedTime: "11:00 AM",
    contractUploadedAtIso: "2026-01-14",
    paidDate: "Friday, 15 January 2026",
    paidTime: "09:20 AM",
    paidAtIso: "2026-01-15",
    paymentMethod: "online",
    dueFees: 250,
    deliveryStatus: "required",
    source: "eform",
  },
  {
    id: "mock-cmp-900102",
    orderNumber: "#ORD-02",
    employerName: "Sara Al-Mutairi",
    employerPhone: "+966 550 222 033",
    workerName: "Maria Santos",
    createdDate: "Monday, 11 January 2026",
    createdTime: "09:20 AM",
    createdAtIso: "2026-01-11",
    contractUploadedDate: "Wednesday, 13 January 2026",
    contractUploadedTime: "04:30 PM",
    contractUploadedAtIso: "2026-01-13",
    paidDate: "Thursday, 14 January 2026",
    paidTime: "02:10 PM",
    paidAtIso: "2026-01-14",
    paymentMethod: "manual",
    dueFees: 250,
    deliveryStatus: "notRequired",
    source: "manual",
  },
  {
    id: "mock-cmp-900103",
    orderNumber: "#ORD-03",
    employerName: "Fahad Alotaibi",
    employerPhone: "+966 530 333 044",
    workerName: "Juan Dela Cruz",
    createdDate: "Sunday, 10 January 2026",
    createdTime: "03:10 PM",
    createdAtIso: "2026-01-10",
    contractUploadedDate: "Tuesday, 12 January 2026",
    contractUploadedTime: "09:45 AM",
    contractUploadedAtIso: "2026-01-12",
    paidDate: "Wednesday, 13 January 2026",
    paidTime: "11:30 AM",
    paidAtIso: "2026-01-13",
    paymentMethod: "online",
    dueFees: 300,
    deliveryStatus: "required",
    source: "eform",
  },
  {
    id: "mock-cmp-900104",
    orderNumber: "#ORD-04",
    employerName: "Maha Alharbi",
    employerPhone: "+966 520 444 055",
    workerName: "Ana Reyes",
    createdDate: "Saturday, 9 January 2026",
    createdTime: "01:05 PM",
    createdAtIso: "2026-01-09",
    contractUploadedDate: "Monday, 11 January 2026",
    contractUploadedTime: "03:00 PM",
    contractUploadedAtIso: "2026-01-11",
    paidDate: "Tuesday, 12 January 2026",
    paidTime: "04:45 PM",
    paidAtIso: "2026-01-12",
    paymentMethod: "manual",
    dueFees: 250,
    deliveryStatus: "notRequired",
    source: "manual",
  },
  {
    id: "mock-cmp-900105",
    orderNumber: "#ORD-05",
    employerName: "Turki Al-Dosari",
    employerPhone: "+966 555 555 066",
    workerName: "Pedro Garcia",
    createdDate: "Friday, 8 January 2026",
    createdTime: "11:30 AM",
    createdAtIso: "2026-01-08",
    contractUploadedDate: "Sunday, 10 January 2026",
    contractUploadedTime: "01:15 PM",
    contractUploadedAtIso: "2026-01-10",
    paidDate: "Monday, 11 January 2026",
    paidTime: "10:00 AM",
    paidAtIso: "2026-01-11",
    paymentMethod: "online",
    dueFees: 275,
    deliveryStatus: "required",
    source: "eform",
  },
  {
    id: "mock-cmp-900106",
    orderNumber: "#ORD-06",
    employerName: "Nasser Al-Ghamdi",
    employerPhone: "+966 540 666 077",
    workerName: "Lisa Mendoza",
    createdDate: "Thursday, 7 January 2026",
    createdTime: "08:50 AM",
    createdAtIso: "2026-01-07",
    contractUploadedDate: "Saturday, 9 January 2026",
    contractUploadedTime: "10:20 AM",
    contractUploadedAtIso: "2026-01-09",
    paidDate: "Sunday, 10 January 2026",
    paidTime: "01:40 PM",
    paidAtIso: "2026-01-10",
    paymentMethod: "manual",
    dueFees: 250,
    deliveryStatus: "required",
    source: "manual",
  },
  {
    id: "mock-cmp-900107",
    orderNumber: "#ORD-07",
    employerName: "Reem Al-Shehri",
    employerPhone: "+966 512 777 088",
    workerName: "Carlos Rivera",
    createdDate: "Wednesday, 6 January 2026",
    createdTime: "02:40 PM",
    createdAtIso: "2026-01-06",
    contractUploadedDate: "Friday, 8 January 2026",
    contractUploadedTime: "05:45 PM",
    contractUploadedAtIso: "2026-01-08",
    paidDate: "Saturday, 9 January 2026",
    paidTime: "08:15 AM",
    paidAtIso: "2026-01-09",
    paymentMethod: "online",
    dueFees: 320,
    deliveryStatus: "notRequired",
    source: "eform",
  },
  {
    id: "mock-cmp-900108",
    orderNumber: "#ORD-08",
    employerName: "Omar Al-Harbi",
    employerPhone: "+966 560 888 099",
    workerName: "Sofia Lopez",
    createdDate: "Tuesday, 5 January 2026",
    createdTime: "04:15 PM",
    createdAtIso: "2026-01-05",
    contractUploadedDate: "Thursday, 7 January 2026",
    contractUploadedTime: "02:00 PM",
    contractUploadedAtIso: "2026-01-07",
    paidDate: "Friday, 8 January 2026",
    paidTime: "03:25 PM",
    paidAtIso: "2026-01-08",
    paymentMethod: "manual",
    dueFees: 250,
    deliveryStatus: "required",
    source: "manual",
  },
];

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterCompletedOrders(
  orders: CompletedOrderRow[],
  filters: CompletedOrdersFilterValues
): CompletedOrderRow[] {
  const query = filters.search.trim().toLowerCase();
  const fromIso = filters.fromDate ? toIsoDate(filters.fromDate) : undefined;
  const toIso = filters.toDate ? toIsoDate(filters.toDate) : undefined;

  return orders.filter((order) => {
    if (filters.orderType !== "all" && order.source !== filters.orderType) {
      return false;
    }

    if (
      filters.paymentMethod !== "all" &&
      order.paymentMethod !== filters.paymentMethod
    ) {
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

    if (fromIso && order.createdAtIso < fromIso) return false;
    if (toIso && order.createdAtIso > toIso) return false;

    return true;
  });
}
