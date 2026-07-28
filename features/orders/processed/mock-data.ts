import type {
  ProcessedOrderRow,
  ProcessedOrdersFilterValues,
} from "@/features/orders/types";

/** RTL: first item renders on the right (matches design order). */
export const PROCESSED_ORDER_INDICATORS = [
  {
    key: "total" as const,
    value: "32",
    change: "+3%",
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/danger.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "eform" as const,
    value: "19",
    change: "+24%",
    periodKey: "periodEformShare" as const,
    iconSrc: "/svg/info-circle.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "manual" as const,
    value: "13",
    change: "+24%",
    periodKey: "periodManualShare" as const,
    iconSrc: "/svg/warning-2.svg",
    bgClassName: "bg-brand-primary/10",
  },
];

export const DEFAULT_PROCESSED_ORDERS_FILTERS: ProcessedOrdersFilterValues = {
  fromDate: undefined,
  toDate: undefined,
  expectedExecution: undefined,
  search: "",
  orderType: "all",
};

export const PROCESSED_ORDERS: ProcessedOrderRow[] = [
  {
    id: "1",
    orderNumber: "#ORD-01",
    contractNumber: "CNT-2026-1248",
    employerName: "Abdullah Al-Qahtani",
    employerPhone: "+966 514 111 001",
    workerName: "Yassin Al-Nahrani",
    createdDate: "Tuesday, 12 January 2026",
    createdTime: "10:45 AM",
    createdAtIso: "2026-01-12",
    approvedDate: "Wednesday, 13 January 2026",
    approvedTime: "02:15 PM",
    approvedAtIso: "2026-01-13",
    executionDateIso: "2026-02-19",
    source: "eform",
    reviewerName: "Ahmed bin Khalid",
    reviewerInitials: "AK",
    reviewerAvatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
  },
  {
    id: "2",
    orderNumber: "#ORD-02",
    contractNumber: "CNT-2026-1249",
    employerName: "Sara Al-Mutairi",
    employerPhone: "+966 550 222 033",
    workerName: "Maria Santos",
    createdDate: "Monday, 11 January 2026",
    createdTime: "09:20 AM",
    createdAtIso: "2026-01-11",
    approvedDate: "Tuesday, 12 January 2026",
    approvedTime: "11:00 AM",
    approvedAtIso: "2026-01-12",
    executionDateIso: "2026-02-20",
    source: "manual",
    reviewerName: "Noura Saleh",
    reviewerInitials: "NS",
    reviewerAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
  },
  {
    id: "3",
    orderNumber: "#ORD-03",
    contractNumber: "CNT-2026-1250",
    employerName: "Fahad Alotaibi",
    employerPhone: "+966 530 333 044",
    workerName: "Juan Dela Cruz",
    createdDate: "Sunday, 10 January 2026",
    createdTime: "03:10 PM",
    createdAtIso: "2026-01-10",
    approvedDate: "Monday, 11 January 2026",
    approvedTime: "04:40 PM",
    approvedAtIso: "2026-01-11",
    executionDateIso: "2026-02-21",
    source: "eform",
    reviewerName: "Khalid Alotaibi",
    reviewerInitials: "KA",
  },
  {
    id: "4",
    orderNumber: "#ORD-04",
    contractNumber: "CNT-2026-1251",
    employerName: "Maha Alharbi",
    employerPhone: "+966 520 444 055",
    workerName: "Ana Reyes",
    createdDate: "Saturday, 9 January 2026",
    createdTime: "01:05 PM",
    createdAtIso: "2026-01-09",
    approvedDate: "Sunday, 10 January 2026",
    approvedTime: "09:30 AM",
    approvedAtIso: "2026-01-10",
    executionDateIso: "2026-02-23",
    source: "manual",
    reviewerName: "Huda Mansour",
    reviewerInitials: "HM",
    reviewerAvatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
  },
  {
    id: "5",
    orderNumber: "#ORD-05",
    contractNumber: "CNT-2026-1252",
    employerName: "Turki Al-Dosari",
    employerPhone: "+966 555 555 066",
    workerName: "Pedro Garcia",
    createdDate: "Friday, 8 January 2026",
    createdTime: "11:30 AM",
    createdAtIso: "2026-01-08",
    approvedDate: "Saturday, 9 January 2026",
    approvedTime: "01:20 PM",
    approvedAtIso: "2026-01-09",
    executionDateIso: "2026-02-24",
    source: "eform",
    reviewerName: "Ahmed bin Khalid",
    reviewerInitials: "AK",
    reviewerAvatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
  },
  {
    id: "6",
    orderNumber: "#ORD-06",
    contractNumber: "CNT-2026-1253",
    employerName: "Nasser Al-Ghamdi",
    employerPhone: "+966 540 666 077",
    workerName: "Lisa Mendoza",
    createdDate: "Thursday, 7 January 2026",
    createdTime: "08:50 AM",
    createdAtIso: "2026-01-07",
    approvedDate: "Friday, 8 January 2026",
    approvedTime: "10:15 AM",
    approvedAtIso: "2026-01-08",
    executionDateIso: "2026-02-25",
    source: "eform",
    reviewerName: "Sara Al-Mutairi",
    reviewerInitials: "SM",
  },
  {
    id: "7",
    orderNumber: "#ORD-07",
    contractNumber: "CNT-2026-1254",
    employerName: "Reem Al-Shehri",
    employerPhone: "+966 512 777 088",
    workerName: "Carlos Rivera",
    createdDate: "Wednesday, 6 January 2026",
    createdTime: "02:40 PM",
    createdAtIso: "2026-01-06",
    approvedDate: "Thursday, 7 January 2026",
    approvedTime: "05:00 PM",
    approvedAtIso: "2026-01-07",
    executionDateIso: "2026-02-26",
    source: "manual",
    reviewerName: "Noura Saleh",
    reviewerInitials: "NS",
    reviewerAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
  },
  {
    id: "8",
    orderNumber: "#ORD-08",
    contractNumber: "CNT-2026-1255",
    employerName: "Omar Al-Harbi",
    employerPhone: "+966 560 888 099",
    workerName: "Sofia Lopez",
    createdDate: "Tuesday, 5 January 2026",
    createdTime: "04:15 PM",
    createdAtIso: "2026-01-05",
    approvedDate: "Wednesday, 6 January 2026",
    approvedTime: "12:45 PM",
    approvedAtIso: "2026-01-06",
    executionDateIso: "2026-02-27",
    source: "eform",
    reviewerName: "Khalid Alotaibi",
    reviewerInitials: "KA",
  },
];

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterProcessedOrders(
  orders: ProcessedOrderRow[],
  filters: ProcessedOrdersFilterValues
): ProcessedOrderRow[] {
  const query = filters.search.trim().toLowerCase();
  const fromIso = filters.fromDate ? toIsoDate(filters.fromDate) : undefined;
  const toIso = filters.toDate ? toIsoDate(filters.toDate) : undefined;
  const expectedIso = filters.expectedExecution
    ? toIsoDate(filters.expectedExecution)
    : undefined;

  return orders.filter((order) => {
    if (filters.orderType !== "all" && order.source !== filters.orderType) {
      return false;
    }

    if (query) {
      const haystack =
        `${order.orderNumber} ${order.contractNumber} ${order.employerName}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (fromIso && order.createdAtIso < fromIso) return false;
    if (toIso && order.createdAtIso > toIso) return false;
    if (expectedIso && order.executionDateIso !== expectedIso) return false;

    return true;
  });
}
