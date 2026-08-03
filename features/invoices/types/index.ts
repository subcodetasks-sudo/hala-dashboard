import type { OrderSource } from "@/features/home/types";
import type { PaymentMethod } from "@/features/orders/types";

export type { OrderSource, PaymentMethod };

/** Availability of the linked contract document. */
export type InvoiceContractStatus = "available" | "temporarily_unavailable";

export type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  employerName: string;
  employerPhone: string;
  workerName: string;
  paidDate: string;
  paidTime: string;
  paidAtIso: string;
  paidAtDateTime: string;
  amount: number;
  paymentMethod: PaymentMethod;
  source: OrderSource;
  contractStatus: InvoiceContractStatus;
};

export type InvoicesFilterValues = {
  paidAt: Date | undefined;
  search: string;
  orderType: "all" | OrderSource;
  paymentMethod: "all" | PaymentMethod;
  contractStatus: "all" | InvoiceContractStatus;
};
