import type {
  RefundOrderRow,
  RefundOrdersFilterValues,
} from "@/features/orders/types";

export const DEFAULT_REFUND_ORDERS_FILTERS: RefundOrdersFilterValues = {
  requestedAt: undefined,
  search: "",
  orderType: "all",
  refundStatus: "all",
  refundMethod: "all",
};

const BASE_EMPLOYER = {
  employerName: "عبد الله القحطاني",
  employerPhone: "+966 514 111 001",
  workerName: "ياسين الظهراني",
  requestedDate: "Tuesday, 12 January 2026",
  requestedTime: "10:30 AM",
  requestedAtIso: "2026-01-12",
  requestedAtDateTime: "2026-01-12 10:30:00",
  refundReason: "Order cancelled after payment",
  refundAmount: 250,
} as const;

export const REFUND_ORDERS: RefundOrderRow[] = [
  {
    id: "refund-mock-01",
    orderNumber: "#ORD-01",
    ...BASE_EMPLOYER,
    source: "eform",
    refundMethod: "bank_transfer",
    status: "pending",
  },
  {
    id: "refund-mock-02",
    orderNumber: "#ORD-01",
    ...BASE_EMPLOYER,
    source: "manual",
    refundMethod: "wallet",
    status: "pending",
  },
  {
    id: "refund-mock-03",
    orderNumber: "#ORD-01",
    ...BASE_EMPLOYER,
    source: "eform",
    refundMethod: "cash",
    status: "pending",
  },
  {
    id: "refund-mock-04",
    orderNumber: "#ORD-01",
    ...BASE_EMPLOYER,
    source: "manual",
    refundMethod: "bank_transfer",
    status: "pending",
  },
  {
    id: "refund-mock-05",
    orderNumber: "#ORD-01",
    ...BASE_EMPLOYER,
    source: "eform",
    refundMethod: "wallet",
    status: "pending",
  },
  {
    id: "refund-mock-06",
    orderNumber: "#ORD-01",
    ...BASE_EMPLOYER,
    source: "manual",
    refundMethod: "bank_transfer",
    status: "completed",
  },
  {
    id: "refund-mock-07",
    orderNumber: "#ORD-01",
    ...BASE_EMPLOYER,
    source: "eform",
    refundMethod: "cash",
    status: "completed",
  },
  {
    id: "refund-mock-08",
    orderNumber: "#ORD-01",
    ...BASE_EMPLOYER,
    source: "manual",
    refundMethod: "wallet",
    status: "completed",
  },
];

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterRefundOrders(
  orders: RefundOrderRow[],
  filters: RefundOrdersFilterValues,
): RefundOrderRow[] {
  const search = filters.search.trim().toLowerCase();
  const requestedIso = filters.requestedAt
    ? toIsoDate(filters.requestedAt)
    : undefined;

  return orders.filter((order) => {
    if (filters.orderType !== "all" && order.source !== filters.orderType) {
      return false;
    }

    if (
      filters.refundStatus !== "all" &&
      order.status !== filters.refundStatus
    ) {
      return false;
    }

    if (
      filters.refundMethod !== "all" &&
      order.refundMethod !== filters.refundMethod
    ) {
      return false;
    }

    if (requestedIso && order.requestedAtIso !== requestedIso) {
      return false;
    }

    if (search) {
      const haystack = [
        order.orderNumber,
        order.employerName,
        order.employerPhone,
        order.workerName,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });
}
