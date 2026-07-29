import { MOCK_ORDERS } from "@/features/home/mock-data";
import { getOrderReviewFromApiMock } from "@/features/orders/api-mock-data";
import type {
  NewOrderRow,
  OrderDocument,
  OrderDocumentType,
  OrderReviewDetail,
  OrdersFilterValues,
} from "@/features/orders/types";

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

const WORKER_PHONE_BY_ORDER: Record<string, string> = {
  "1": "514111001",
  "2": "521334455",
  "3": "533445566",
  "4": "545667788",
  "5": "558778899",
  "6": "509112233",
  "7": "536554433",
  "8": "552667788",
};

const WORKER_BIRTH_DATE_BY_ORDER: Record<string, string> = {
  "1": "1992-12-10",
  "2": "1990-08-03",
  "3": "1994-05-18",
  "4": "1991-01-27",
  "5": "1989-11-09",
  "6": "1993-06-14",
  "7": "1995-09-22",
  "8": "1992-04-30",
};

const WORKER_HOME_ADDRESS_BY_ORDER: Record<string, string> = {
  "1": "Al Nuzha District, King Fahd Road, Riyadh",
  "2": "Mandaue City, Cebu, Philippines",
  "3": "Quezon City, Metro Manila, Philippines",
  "4": "Davao City, Davao del Sur, Philippines",
  "5": "Bacolod City, Negros Occidental, Philippines",
  "6": "Al Malaz District, Riyadh",
  "7": "Caloocan City, Metro Manila, Philippines",
  "8": "Iloilo City, Iloilo, Philippines",
};

const WORKER_PASSPORT_ISSUE_PLACE_BY_ORDER: Record<string, string> = {
  "1": "Philippines",
  "2": "Philippines",
  "3": "Philippines",
  "4": "Philippines",
  "5": "Philippines",
  "6": "Philippines",
  "7": "Philippines",
  "8": "Philippines",
};

const WORKER_PASSPORT_NUMBER_BY_ORDER: Record<string, string> = {
  "1": "P1234567A",
  "2": "P2345678B",
  "3": "P3456789C",
  "4": "P4567890D",
  "5": "P5678901E",
  "6": "P6789012F",
  "7": "P7890123G",
  "8": "P8901234H",
};

const WORKER_PASSPORT_ISSUE_DATE_BY_ORDER: Record<string, string> = {
  "1": "2026-12-10",
  "2": "2025-07-18",
  "3": "2026-02-11",
  "4": "2025-09-06",
  "5": "2024-03-22",
  "6": "2025-01-30",
  "7": "2026-05-19",
  "8": "2024-10-14",
};

const WORKER_PASSPORT_EXPIRY_DATE_BY_ORDER: Record<string, string> = {
  "1": "2027-12-12",
  "2": "2030-07-17",
  "3": "2031-02-10",
  "4": "2030-09-05",
  "5": "2029-03-21",
  "6": "2030-01-29",
  "7": "2031-05-18",
  "8": "2029-10-13",
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

export const PASSPORT_ISSUE_PLACES = [
  "Philippines",
  "India",
  "Bangladesh",
  "Pakistan",
  "Nepal",
  "Sri Lanka",
] as const;

export function getOrderReviewByOrderId(
  orderId: string
): OrderReviewDetail | undefined {
  // Temp: prefer API-shaped mock details when present for this ID.
  const apiReview = getOrderReviewFromApiMock(orderId);
  if (apiReview) return apiReview;

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
    workerPhoneLocal: WORKER_PHONE_BY_ORDER[order.id] ?? "514111001",
    workerBirthDate: WORKER_BIRTH_DATE_BY_ORDER[order.id] ?? "1992-12-10",
    workerHomeAddress:
      WORKER_HOME_ADDRESS_BY_ORDER[order.id] ??
      "Makati City, Metro Manila, Philippines",
    workerPassportIssuePlace:
      WORKER_PASSPORT_ISSUE_PLACE_BY_ORDER[order.id] ?? "Philippines",
    workerPassportNumber:
      WORKER_PASSPORT_NUMBER_BY_ORDER[order.id] ?? "P1234567A",
    workerPassportIssueDate:
      WORKER_PASSPORT_ISSUE_DATE_BY_ORDER[order.id] ?? "2026-12-10",
    workerPassportExpiryDate:
      WORKER_PASSPORT_EXPIRY_DATE_BY_ORDER[order.id] ?? "2027-12-12",
    expectedExecutionLabel: order.executionDate,
    source: order.source,
    status: "new",
    statusLabel: "New",
    assignee: "System Admin",
    createdAtLabel: order.createdDate,
    createdTimeLabel: order.createdTime,
    relativeTimeLabel: "10m",
    hold: null,
    changeHistory: [
      {
        id: `${order.id}-h1`,
        employee: "Ahmed bin Khalid",
        actionType: "startReview",
        dateTime: `${order.createdDate} · ${order.createdTime}`,
      },
    ],
    documents: getOrderDocuments(order.id),
  };
}

const DOCUMENT_TYPES: OrderDocumentType[] = [
  "nationalId",
  "workerId",
  "passportFirstPage",
  "passportVisa",
  "exitReentryVisa",
  "employerSignature",
  "workerSignature",
];

function getOrderDocuments(orderId: string): OrderDocument[] {
  return DOCUMENT_TYPES.map((type) => ({
    id: `${orderId}-${type}`,
    type,
    uploadedAtIso: "2026-06-12",
    sizeLabel: "1.2 MB",
    format: "PDF",
    url: "#",
  }));
}
