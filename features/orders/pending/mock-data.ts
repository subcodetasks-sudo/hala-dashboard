import type {
  PendingOrderRow,
  PendingOrdersFilterValues,
} from "@/features/orders/types";

/** RTL: first item renders on the right (matches design order). */
export const PENDING_ORDER_INDICATORS = [
  {
    key: "total" as const,
    value: "18",
    change: "+3%",
    iconSrc: "/svg/danger.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "incompleteData" as const,
    value: "08",
    change: "+24%",
    iconSrc: "/svg/info-circle.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "missingDocuments" as const,
    value: "09",
    change: "+24%",
    iconSrc: "/svg/warning-2.svg",
    bgClassName: "bg-brand-primary/10",
  },
];

export const DEFAULT_PENDING_ORDERS_FILTERS: PendingOrdersFilterValues = {
  fromDate: undefined,
  toDate: undefined,
  search: "",
  suspensionReason: "all",
};

export const PENDING_ORDERS: PendingOrderRow[] = [
  {
    id: "1",
    orderNumber: "#ORD-01",
    employerName: "Abdullah Al-Qahtani",
    employerPhone: "+966 514 111 001",
    workerName: "Yassin Al-Nahrani",
    createdDate: "Tuesday, 12 January 2026",
    createdTime: "10:45 AM",
    createdAtIso: "2026-01-12",
    suspensionReason: "missingDocument",
    suspendedDate: "Tuesday, 13 January 2026",
    suspendedTime: "02:15 PM",
    suspendedAtIso: "2026-01-13",
    suspendedByName: "Ahmed bin Khalid",
    suspendedByInitials: "AK",
    suspendedByAvatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
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
    suspensionReason: "incompleteWorkerData",
    suspendedDate: "Monday, 12 January 2026",
    suspendedTime: "11:00 AM",
    suspendedAtIso: "2026-01-12",
    suspendedByName: "Noura Saleh",
    suspendedByInitials: "NS",
    suspendedByAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
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
    suspensionReason: "unclearDocument",
    suspendedDate: "Sunday, 11 January 2026",
    suspendedTime: "04:40 PM",
    suspendedAtIso: "2026-01-11",
    suspendedByName: "Khalid Alotaibi",
    suspendedByInitials: "KA",
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
    suspensionReason: "dataConflict",
    suspendedDate: "Saturday, 10 January 2026",
    suspendedTime: "09:30 AM",
    suspendedAtIso: "2026-01-10",
    suspendedByName: "Huda Mansour",
    suspendedByInitials: "HM",
    suspendedByAvatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
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
    suspensionReason: "incompleteEmployerData",
    suspendedDate: "Friday, 9 January 2026",
    suspendedTime: "01:20 PM",
    suspendedAtIso: "2026-01-09",
    suspendedByName: "Ahmed bin Khalid",
    suspendedByInitials: "AK",
    suspendedByAvatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
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
    suspensionReason: "missingDocument",
    suspendedDate: "Thursday, 8 January 2026",
    suspendedTime: "10:15 AM",
    suspendedAtIso: "2026-01-08",
    suspendedByName: "Sara Al-Mutairi",
    suspendedByInitials: "SM",
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
    suspensionReason: "unclearDocument",
    suspendedDate: "Wednesday, 7 January 2026",
    suspendedTime: "05:00 PM",
    suspendedAtIso: "2026-01-07",
    suspendedByName: "Noura Saleh",
    suspendedByInitials: "NS",
    suspendedByAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
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
    suspensionReason: "dataConflict",
    suspendedDate: "Tuesday, 6 January 2026",
    suspendedTime: "12:45 PM",
    suspendedAtIso: "2026-01-06",
    suspendedByName: "Khalid Alotaibi",
    suspendedByInitials: "KA",
  },
];

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterPendingOrders(
  orders: PendingOrderRow[],
  filters: PendingOrdersFilterValues
): PendingOrderRow[] {
  const query = filters.search.trim().toLowerCase();
  const fromIso = filters.fromDate ? toIsoDate(filters.fromDate) : undefined;
  const toIso = filters.toDate ? toIsoDate(filters.toDate) : undefined;

  return orders.filter((order) => {
    if (
      filters.suspensionReason !== "all" &&
      order.suspensionReason !== filters.suspensionReason
    ) {
      return false;
    }

    if (query) {
      const haystack =
        `${order.orderNumber} ${order.employerName}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (fromIso && order.suspendedAtIso < fromIso) return false;
    if (toIso && order.suspendedAtIso > toIso) return false;

    return true;
  });
}
