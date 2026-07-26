import {
  MOCK_ORDERS,
  type MockOrder,
  type OrderSource,
} from "@/features/home/mock-data";

export type { MockOrder, OrderSource };

/** RTL: first item renders on the right (matches design order). */
export const NEW_ORDER_INDICATORS = [
  {
    key: "total" as const,
    value: "24",
    change: "+24%",
    iconSrc: "/svg/receipt-2.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "epayment" as const,
    value: "20",
    change: "+24%",
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "manual" as const,
    value: "04",
    change: "+24%",
    iconSrc: "/svg/export.svg",
    bgClassName: "bg-brand-primary/10",
  },
];

export type NewOrderRow = MockOrder & {
  createdAtIso: string;
  executionDateIso: string;
};

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

export type OrdersFilterValues = {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  expectedExecution: Date | undefined;
  search: string;
  source: "all" | OrderSource;
};

export const DEFAULT_ORDERS_FILTERS: OrdersFilterValues = {
  fromDate: undefined,
  toDate: undefined,
  expectedExecution: undefined,
  search: "",
  source: "all",
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

export type ChangeHistoryRow = {
  id: string;
  employee: string;
  actionType: string;
  dateTime: string;
};

export type OrderReviewDetail = {
  id: string;
  orderNumber: string;
  employerName: string;
  nationalId: string;
  phoneLocal: string;
  city: string;
  address: string;
  workerName: string;
  expectedExecutionLabel: string;
  source: OrderSource;
  status: "new";
  assignee: string;
  createdAtLabel: string;
  createdTimeLabel: string;
  relativeTimeLabel: string;
  changeHistory: ChangeHistoryRow[];
};

const CITY_BY_ORDER: Record<string, string> = {
  "1": "Riyadh",
  "2": "Jeddah",
  "3": "Dammam",
  "4": "Riyadh",
  "5": "Mecca",
  "6": "Riyadh",
  "7": "Medina",
  "8": "Khobar",
};

const ADDRESS_BY_ORDER: Record<string, string> = {
  "1": "Al-Nuzha Dist., King Fahd Rd, Riyadh",
  "2": "Al-Rawdah Dist., Prince Sultan St, Jeddah",
  "3": "Al-Faisaliyah Dist., King Saud Rd, Dammam",
  "4": "Al-Olaya Dist., Olaya St, Riyadh",
  "5": "Al-Aziziyah Dist., Ibrahim Al-Khalil Rd, Mecca",
  "6": "Al-Nuzha Dist., King Fahd Rd, Riyadh",
  "7": "Quba Dist., King Abdulaziz Rd, Medina",
  "8": "Al-Khobar Corniche, Prince Turki St, Khobar",
};

const NATIONAL_ID_BY_ORDER: Record<string, string> = {
  "1": "1023456789",
  "2": "1098765432",
  "3": "2012345678",
  "4": "1087654321",
  "5": "2034567890",
  "6": "1045678901",
  "7": "2056789012",
  "8": "1067890123",
};

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

export function getOrderReviewByOrderId(
  orderId: string
): OrderReviewDetail | undefined {
  const order = NEW_ORDERS.find((row) => row.id === orderId);
  if (!order) return undefined;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    employerName: order.customerName,
    nationalId: NATIONAL_ID_BY_ORDER[order.id] ?? "1023456789",
    phoneLocal: toSaudiPhoneLocal(order.customerPhone),
    city: CITY_BY_ORDER[order.id] ?? "Riyadh",
    address: ADDRESS_BY_ORDER[order.id] ?? "Riyadh",
    workerName: order.handlerName,
    expectedExecutionLabel: order.executionDate,
    source: order.source,
    status: "new",
    assignee: "System Admin",
    createdAtLabel: order.createdDate,
    createdTimeLabel: order.createdTime,
    relativeTimeLabel: "10m",
    changeHistory: [
      {
        id: `${order.id}-h1`,
        employee: "Ahmed bin Khalid",
        actionType: "startReview",
        dateTime: `${order.createdDate} · ${order.createdTime}`,
      },
    ],
  };
}
