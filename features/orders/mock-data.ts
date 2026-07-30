import { MOCK_ORDERS } from "@/features/home/mock-data";
import type { NewOrderRow, OrdersFilterValues } from "@/features/orders/types";

/** Mock new orders with ISO dates for client-side filter matching. */
export const NEW_ORDERS: NewOrderRow[] = [
  {
    ...MOCK_ORDERS[0],
    createdAtIso: "2026-01-12",
    executionDateIso: "2026-02-19",
  },
  {
    ...MOCK_ORDERS[1],
    createdAtIso: "2026-01-11",
    executionDateIso: "2026-02-20",
  },
  {
    ...MOCK_ORDERS[2],
    createdAtIso: "2026-01-10",
    executionDateIso: "2026-02-21",
  },
  {
    ...MOCK_ORDERS[3],
    createdAtIso: "2026-01-09",
    executionDateIso: "2026-02-23",
  },
  {
    ...MOCK_ORDERS[4],
    createdAtIso: "2026-01-08",
    executionDateIso: "2026-02-24",
  },
  {
    id: "6",
    orderNumber: "#ORD-06",
    customerName: "Abdullah Al-Qahtani",
    customerPhone: "+966 550 666 012",
    handlerName: "Noura Saleh",
    createdDate: "Thursday, 7 January 2026",
    createdTime: "08:50 AM",
    source: "eform",
    executionDate: "Wednesday, 25 February 2026",
    status: "new",
    createdAtIso: "2026-01-07",
    executionDateIso: "2026-02-25",
  },
  {
    id: "7",
    orderNumber: "#ORD-07",
    customerName: "Maha Alharbi",
    customerPhone: "+966 530 777 033",
    handlerName: "Khalid Alotaibi",
    createdDate: "Wednesday, 6 January 2026",
    createdTime: "01:20 PM",
    source: "manual",
    executionDate: "Thursday, 26 February 2026",
    status: "new",
    createdAtIso: "2026-01-06",
    executionDateIso: "2026-02-26",
  },
  {
    id: "8",
    orderNumber: "#ORD-08",
    customerName: "Fahad Alotaibi",
    customerPhone: "+966 520 888 044",
    handlerName: "Huda Mansour",
    createdDate: "Tuesday, 5 January 2026",
    createdTime: "03:45 PM",
    source: "eform",
    executionDate: "Friday, 27 February 2026",
    status: "new",
    createdAtIso: "2026-01-05",
    executionDateIso: "2026-02-27",
  },
];

export const DEFAULT_ORDERS_FILTERS: OrdersFilterValues = {
  fromDate: undefined,
  toDate: undefined,
  expectedExecution: undefined,
  search: "",
  source: "all",
};

/** Home page defaults — status is user-selectable there. */
export const DEFAULT_HOME_ORDERS_FILTERS: OrdersFilterValues = {
  ...DEFAULT_ORDERS_FILTERS,
  status: "all",
};

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterNewOrders(
  orders: NewOrderRow[],
  filters: OrdersFilterValues
): NewOrderRow[] {
  const query = filters.search.trim().toLowerCase();
  const fromIso = filters.fromDate ? toIsoDate(filters.fromDate) : undefined;
  const toIso = filters.toDate ? toIsoDate(filters.toDate) : undefined;
  const expectedIso = filters.expectedExecution
    ? toIsoDate(filters.expectedExecution)
    : undefined;

  return orders.filter((order) => {
    if (filters.source !== "all" && order.source !== filters.source) {
      return false;
    }

    if (query) {
      const haystack =
        `${order.orderNumber} ${order.customerName}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (fromIso && order.createdAtIso < fromIso) return false;
    if (toIso && order.createdAtIso > toIso) return false;
    if (expectedIso && order.executionDateIso !== expectedIso) return false;

    return true;
  });
}

/** Strip +966 / 966 / leading 0 so only the 9 local Saudi mobile digits remain. */
export function toSaudiPhoneLocal(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("966") && digits.length >= 12) {
    return digits.slice(3, 12);
  }
  if (digits.startsWith("0") && digits.length >= 10) {
    return digits.slice(1, 10);
  }
  if (digits.length >= 9) {
    return digits.slice(-9);
  }
  return digits;
}

export const SAUDI_CITIES = [
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Mecca",
  "Medina",
  "Khobar",
  "Taif",
  "Abha",
] as const;

export const PASSPORT_ISSUE_PLACES = [
  "Philippines",
  "India",
  "Bangladesh",
  "Pakistan",
  "Nepal",
  "Sri Lanka",
] as const;

