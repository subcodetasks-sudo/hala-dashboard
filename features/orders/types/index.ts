import type { MockOrder, OrderSource } from "@/features/home/types";

export type { MockOrder, OrderSource };

export type NewOrderRow = MockOrder & {
  createdAtIso: string;
  executionDateIso: string;
};

export type SuspensionReason =
  | "missingDocument"
  | "incompleteWorkerData"
  | "unclearDocument"
  | "dataConflict"
  | "incompleteEmployerData"
  | "other";

export type PendingOrderRow = {
  id: string;
  orderNumber: string;
  employerName: string;
  employerPhone: string;
  workerName: string;
  createdDate: string;
  createdTime: string;
  createdAtIso: string;
  suspensionReason: SuspensionReason;
  suspendedDate: string;
  suspendedTime: string;
  suspendedAtIso: string;
  suspendedByName: string;
  suspendedByInitials: string;
  suspendedByAvatarUrl?: string;
};

export type OrdersFilterValues = {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  expectedExecution: Date | undefined;
  search: string;
  source: "all" | OrderSource;
};

export type PendingOrdersFilterValues = {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  search: string;
  suspensionReason: "all" | SuspensionReason;
};

export type ProcessedOrderRow = {
  id: string;
  orderNumber: string;
  contractNumber: string;
  employerName: string;
  employerPhone: string;
  workerName: string;
  createdDate: string;
  createdTime: string;
  createdAtIso: string;
  approvedDate: string;
  approvedTime: string;
  approvedAtIso: string;
  executionDateIso: string;
  source: OrderSource;
  reviewerName: string;
  reviewerInitials: string;
  reviewerAvatarUrl?: string;
};

export type ProcessedOrdersFilterValues = {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  expectedExecution: Date | undefined;
  search: string;
  orderType: "all" | OrderSource;
};

export type VerificationOrderStatus =
  | "sentForVerification"
  | "finalContractUploaded";

export type VerificationOrderRow = {
  id: string;
  orderNumber: string;
  contractNumber: string;
  employerName: string;
  employerPhone: string;
  workerName: string;
  createdDate: string;
  createdTime: string;
  createdAtIso: string;
  handlerName: string;
  handlerInitials: string;
  handlerAvatarUrl?: string;
  status: VerificationOrderStatus;
};

export type VerificationOrdersFilterValues = {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  search: string;
  status: "all" | VerificationOrderStatus;
};

export type DeliveryStatus = "required" | "notRequired";

export type PaymentOrderRow = {
  id: string;
  orderNumber: string;
  employerName: string;
  employerPhone: string;
  workerName: string;
  createdDate: string;
  createdTime: string;
  createdAtIso: string;
  processedDate: string;
  processedTime: string;
  processedAtIso: string;
  contractUploadedDate: string;
  contractUploadedTime: string;
  contractUploadedAtIso: string;
  source: OrderSource;
  dueFees: number;
  deliveryStatus: DeliveryStatus;
};

export type PaymentOrdersFilterValues = {
  createdAt: Date | undefined;
  contractUploadedAt: Date | undefined;
  search: string;
  orderType: "all" | OrderSource;
  deliveryStatus: "all" | DeliveryStatus;
};

export type ChangeHistoryRow = {
  id: string;
  employee: string;
  actionType: string;
  dateTime: string;
};

export type OrderDocumentType =
  | "nationalId"
  | "workerId"
  | "passportFirstPage"
  | "passportVisa"
  | "exitReentryVisa"
  | "employerSignature"
  | "workerSignature";

export type OrderDocument = {
  id: string;
  type: OrderDocumentType;
  uploadedAtIso: string;
  sizeLabel: string;
  format: string;
  url: string;
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
  workerPhoneLocal: string;
  workerBirthDate: string;
  workerHomeAddress: string;
  workerPassportIssuePlace: string;
  workerPassportNumber: string;
  workerPassportIssueDate: string;
  workerPassportExpiryDate: string;
  expectedExecutionLabel: string;
  source: OrderSource;
  status: "new";
  assignee: string;
  createdAtLabel: string;
  createdTimeLabel: string;
  relativeTimeLabel: string;
  changeHistory: ChangeHistoryRow[];
  documents: OrderDocument[];
};
