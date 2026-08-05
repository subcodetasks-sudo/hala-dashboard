export type TrackingStatus = "available" | "used" | "disabled";

export type TrackingShippingCompany = "aramex" | "smsa" | "spl" | "dhl";

export interface TrackingNumberRow {
  id: string;
  trackingNumber: string;
  shippingCompany: TrackingShippingCompany;
  entryDate: string;
  entryTime: string;
  entryAtIso: string;
  status: TrackingStatus;
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  usageDate?: string;
  usageTime?: string;
  usageAtIso?: string;
}

export interface TrackingFilterValues {
  search: string;
  usageDate?: Date;
  status: string;
  shippingCompany: string;
}

export interface TrackingIndicators {
  total: number;
  available: number;
  used: number;
  growthPercentage: number;
}
