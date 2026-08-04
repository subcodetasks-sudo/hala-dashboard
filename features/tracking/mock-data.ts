import { toIsoDate } from "@/lib/iso-date";
import type {
  TrackingFilterValues,
  TrackingIndicators,
  TrackingNumberRow,
} from "@/features/tracking/types";

export const DEFAULT_TRACKING_FILTERS: TrackingFilterValues = {
  search: "",
  usageDate: undefined,
  status: "all",
  shippingCompany: "all",
};

/**
 * Mock tracking numbers matching the Tracking Numbers Log design.
 * Alternates available / used rows with Aramex & DHL (plus SMSA / SPL for filters).
 */
export const TRACKING_NUMBERS: TrackingNumberRow[] = [
  {
    id: "trk-1",
    trackingNumber: "#928475",
    shippingCompany: "aramex",
    entryDate: "Tuesday, 12 January 2026",
    entryTime: "10:30 AM",
    entryAtIso: "2026-01-12",
    status: "available",
  },
  {
    id: "trk-2",
    trackingNumber: "#928476",
    shippingCompany: "dhl",
    entryDate: "Tuesday, 12 January 2026",
    entryTime: "10:30 AM",
    entryAtIso: "2026-01-12",
    status: "used",
    orderNumber: "#ORD-01",
    customerName: "Abdullah Al-Qahtani",
    customerPhone: "+966 514 111 001",
    usageDate: "Tuesday, 12 January 2026",
    usageTime: "10:30 AM",
    usageAtIso: "2026-01-12",
  },
  {
    id: "trk-3",
    trackingNumber: "#928477",
    shippingCompany: "aramex",
    entryDate: "Tuesday, 12 January 2026",
    entryTime: "10:30 AM",
    entryAtIso: "2026-01-12",
    status: "available",
  },
  {
    id: "trk-4",
    trackingNumber: "#928478",
    shippingCompany: "dhl",
    entryDate: "Tuesday, 12 January 2026",
    entryTime: "10:30 AM",
    entryAtIso: "2026-01-12",
    status: "used",
    orderNumber: "#ORD-02",
    customerName: "Sara Al-Mutairi",
    customerPhone: "+966 550 222 033",
    usageDate: "Tuesday, 12 January 2026",
    usageTime: "11:15 AM",
    usageAtIso: "2026-01-12",
  },
  {
    id: "trk-5",
    trackingNumber: "#928479",
    shippingCompany: "smsa",
    entryDate: "Monday, 11 January 2026",
    entryTime: "09:20 AM",
    entryAtIso: "2026-01-11",
    status: "available",
  },
  {
    id: "trk-6",
    trackingNumber: "#928480",
    shippingCompany: "spl",
    entryDate: "Monday, 11 January 2026",
    entryTime: "02:45 PM",
    entryAtIso: "2026-01-11",
    status: "used",
    orderNumber: "#ORD-03",
    customerName: "Fahad Alotaibi",
    customerPhone: "+966 530 333 044",
    usageDate: "Monday, 11 January 2026",
    usageTime: "04:10 PM",
    usageAtIso: "2026-01-11",
  },
  {
    id: "trk-7",
    trackingNumber: "#928481",
    shippingCompany: "aramex",
    entryDate: "Sunday, 10 January 2026",
    entryTime: "08:50 AM",
    entryAtIso: "2026-01-10",
    status: "available",
  },
  {
    id: "trk-8",
    trackingNumber: "#928482",
    shippingCompany: "dhl",
    entryDate: "Sunday, 10 January 2026",
    entryTime: "01:05 PM",
    entryAtIso: "2026-01-10",
    status: "used",
    orderNumber: "#ORD-04",
    customerName: "Maha Alharbi",
    customerPhone: "+966 520 444 055",
    usageDate: "Sunday, 10 January 2026",
    usageTime: "03:20 PM",
    usageAtIso: "2026-01-10",
  },
  {
    id: "trk-9",
    trackingNumber: "#928483",
    shippingCompany: "smsa",
    entryDate: "Saturday, 9 January 2026",
    entryTime: "11:30 AM",
    entryAtIso: "2026-01-09",
    status: "available",
  },
  {
    id: "trk-10",
    trackingNumber: "#928484",
    shippingCompany: "aramex",
    entryDate: "Friday, 8 January 2026",
    entryTime: "04:15 PM",
    entryAtIso: "2026-01-08",
    status: "used",
    orderNumber: "#ORD-05",
    customerName: "Turki Al-Dosari",
    customerPhone: "+966 555 555 066",
    usageDate: "Saturday, 9 January 2026",
    usageTime: "09:00 AM",
    usageAtIso: "2026-01-09",
  },
];

/** Indicators matching the design values: Total 500, Available 320, Used 180. */
export const TRACKING_INDICATORS: TrackingIndicators = {
  total: 500,
  available: 320,
  used: 180,
  growthPercentage: 24,
};

export const SHIPPING_COMPANY_LABELS: Record<
  TrackingNumberRow["shippingCompany"],
  string
> = {
  aramex: "Aramex",
  dhl: "DHL",
  smsa: "SMSA",
  spl: "SPL",
};

export function filterTrackingNumbers(
  items: TrackingNumberRow[],
  filters: TrackingFilterValues,
): TrackingNumberRow[] {
  const search = filters.search.trim().toLowerCase();
  const usageIso = filters.usageDate ? toIsoDate(filters.usageDate) : undefined;

  return items.filter((item) => {
    if (filters.status !== "all" && item.status !== filters.status) {
      return false;
    }

    if (
      filters.shippingCompany !== "all" &&
      item.shippingCompany !== filters.shippingCompany
    ) {
      return false;
    }

    if (usageIso && item.usageAtIso !== usageIso) {
      return false;
    }

    if (search) {
      const haystack = [
        item.trackingNumber,
        item.orderNumber ?? "",
        item.customerName ?? "",
        item.customerPhone ?? "",
        item.shippingCompany,
        SHIPPING_COMPANY_LABELS[item.shippingCompany],
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    return true;
  });
}
