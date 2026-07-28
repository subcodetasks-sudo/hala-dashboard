import type {
  VerificationOrderRow,
  VerificationOrdersFilterValues,
} from "@/features/orders/types";

export const DEFAULT_VERIFICATION_ORDERS_FILTERS: VerificationOrdersFilterValues =
  {
    fromDate: undefined,
    toDate: undefined,
    search: "",
    status: "all",
  };

export const VERIFICATION_ORDERS: VerificationOrderRow[] = [
  {
    id: "1",
    orderNumber: "#ORD-01",
    contractNumber: "CNT-2026-1248",
    employerName: "Abdullah Al-Qahtani",
    employerPhone: "+966 514 111 001",
    workerName: "Yassin Al-Nahrani",
    createdDate: "Tuesday, 12 January 2026",
    createdTime: "10:30 AM",
    createdAtIso: "2026-01-12",
    handlerName: "Ahmed bin Khalid",
    handlerInitials: "AK",
    handlerAvatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
    status: "sentForVerification",
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
    handlerName: "Noura Saleh",
    handlerInitials: "NS",
    handlerAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
    status: "finalContractUploaded",
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
    handlerName: "Khalid Alotaibi",
    handlerInitials: "KA",
    status: "sentForVerification",
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
    handlerName: "Huda Mansour",
    handlerInitials: "HM",
    handlerAvatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
    status: "finalContractUploaded",
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
    handlerName: "Ahmed bin Khalid",
    handlerInitials: "AK",
    handlerAvatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
    status: "sentForVerification",
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
    handlerName: "Sara Al-Mutairi",
    handlerInitials: "SM",
    status: "sentForVerification",
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
    handlerName: "Noura Saleh",
    handlerInitials: "NS",
    handlerAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
    status: "finalContractUploaded",
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
    handlerName: "Khalid Alotaibi",
    handlerInitials: "KA",
    status: "sentForVerification",
  },
];

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterVerificationOrders(
  orders: VerificationOrderRow[],
  filters: VerificationOrdersFilterValues
): VerificationOrderRow[] {
  const query = filters.search.trim().toLowerCase();
  const fromIso = filters.fromDate ? toIsoDate(filters.fromDate) : undefined;
  const toIso = filters.toDate ? toIsoDate(filters.toDate) : undefined;

  return orders.filter((order) => {
    if (filters.status !== "all" && order.status !== filters.status) {
      return false;
    }

    if (query) {
      const haystack =
        `${order.orderNumber} ${order.contractNumber} ${order.employerName}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (fromIso && order.createdAtIso < fromIso) return false;
    if (toIso && order.createdAtIso > toIso) return false;

    return true;
  });
}
