import type { MockOrder, OrderSource } from "@/features/home/types";

export type { MockOrder, OrderSource };

/** Backend order status slugs (list + detail). */
export type OrderStatus =
  | "draft"
  | "new"
  | "under_review"
  | "processed"
  | "held"
  | "sent_for_authentication"
  | "awaiting_payment"
  | "completed"
  | "cancelled";

/** Backend source slugs. */
export type OrderApiSource = "e_form" | "manual";

export type OrderDeliveryStatus =
  | "not_required"
  | "required"
  | "pending"
  | "delivered";

export type OrderPaymentType = "online" | "manual";

export type OrderRefundStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";

export type OrderRefundMethod = "bank_transfer" | "wallet" | "cash";

export type OrderNamedRef = {
  id: number;
  name_ar: string | null;
  name_en: string | null;
};

export type OrderCity = {
  id: number;
  name_ar: string;
  name_en: string;
};

export type OrderPassportIssuePlace = {
  id: number;
  name_ar: string;
  name_en: string;
};

export type OrderEmployer = {
  employer_name_ar: string | null;
  employer_name_en: string | null;
  national_id: string | null;
  phone: string | null;
  city_id: number | null;
  city: OrderCity | null;
  passport_issue_place_id: number | null;
  passport_issue_place: OrderPassportIssuePlace | null;
};

export type OrderWorker = {
  worker_name_ar: string | null;
  worker_name_en: string | null;
  worker_phone: string | null;
  birth_date: string | null;
  philippines_address: string | null;
  passport_number: string | null;
  passport_issue_date: string | null;
  passport_expiry_date: string | null;
};

export type OrderDocuments = {
  national_id_image: string | null;
  iqama_image: string | null;
  passport_image: string | null;
  exit_reentry_visa: string | null;
  worker_signature: string | null;
  employer_signature: string | null;
  salary: string | null;
};

export type OrderActivity = {
  id: number;
  action: string;
  action_label: string | null;
  notes: string | null;
  created_at: string;
  performed_by: OrderNamedRef | null;
};

/** Flattened order row returned by list endpoints. */
export type OrderListItem = {
  id: number;
  request_number: string | null;
  employer_name_ar: string | null;
  employer_name_en: string | null;
  phone: string | null;
  worker_name_ar: string | null;
  worker_name_en: string | null;
  source: OrderApiSource;
  source_label: string;
  status: OrderStatus;
  status_label: string;
  contract_number: string | null;
  hold_reason: string | null;
  hold_reason_label: string | null;
  hold_notes: string | null;
  held_at: string | null;
  expected_completion_date: string | null;
  delivery_required: boolean;
  delivery_status: OrderDeliveryStatus;
  delivery_status_label: string;
  service_fee: string | null;
  delivery_fee: string | null;
  total_fee: string | null;
  payment_type: OrderPaymentType | null;
  payment_type_label: string | null;
  paid_at: string | null;
  created_at: string;
  submitted_at: string | null;
  processed_at: string | null;
  sent_for_authentication_at: string | null;
  final_contract_uploaded_at: string | null;
  has_final_contract: boolean;
  final_contract_url: string | null;
  payment_proof_url: string | null;
  cancellation_reason: string | null;
  cancellation_reason_label: string | null;
  cancellation_source: string | null;
  cancellation_source_label: string | null;
  cancellation_notes: string | null;
  cancelled_status_before: OrderStatus | null;
  cancelled_at: string | null;
  linked_to_refund: boolean;
  refund_status: OrderRefundStatus | null;
  refund_status_label: string | null;
  refund_method: OrderRefundMethod | null;
  refund_method_label: string | null;
  refund_amount: string | null;
  refund_reason: string | null;
  refund_requested_at: string | null;
  refund_decided_at: string | null;
  refund_rejection_reason: string | null;
  assigned_to: OrderNamedRef | null;
  processed_by: OrderNamedRef | null;
  held_by: OrderNamedRef | null;
  cancelled_by: OrderNamedRef | null;
};

/** Full order payload returned by the detail endpoint. */
export type OrderDetail = {
  id: number;
  request_number: string | null;
  current_step: number;
  status: OrderStatus;
  status_label: string;
  source: OrderApiSource;
  source_label: string;
  is_submitted: boolean;
  submitted_at: string | null;
  expected_completion_date: string | null;
  review_started_at: string | null;
  processed_at: string | null;
  held_at: string | null;
  hold_reason: string | null;
  hold_reason_label: string | null;
  hold_notes: string | null;
  contract_number: string | null;
  contract_qr_code: string | null;
  contract_generated_at: string | null;
  contract_url: string | null;
  sent_for_authentication_at: string | null;
  final_contract_uploaded_at: string | null;
  has_final_contract: boolean;
  final_contract_url: string | null;
  delivery_required: boolean;
  delivery_status: OrderDeliveryStatus;
  delivery_status_label: string;
  service_fee: string | null;
  delivery_fee: string | null;
  total_fee: string | null;
  payment_type: OrderPaymentType | null;
  payment_type_label: string | null;
  paid_at: string | null;
  payment_notification_text: string | null;
  payment_proof_url: string | null;
  cancellation_reason: string | null;
  cancellation_reason_label: string | null;
  cancellation_source: string | null;
  cancellation_source_label: string | null;
  cancellation_notes: string | null;
  cancelled_status_before: OrderStatus | null;
  cancelled_status_before_label: string | null;
  cancelled_at: string | null;
  linked_to_refund: boolean;
  is_frozen: boolean;
  refund_status: OrderRefundStatus | null;
  refund_status_label: string | null;
  refund_method: OrderRefundMethod | null;
  refund_method_label: string | null;
  refund_amount: string | null;
  refund_reason: string | null;
  refund_requested_at: string | null;
  refund_decided_at: string | null;
  refund_rejection_reason: string | null;
  can_approve_refund: boolean;
  can_reject_refund: boolean;
  employer: OrderEmployer;
  worker: OrderWorker;
  documents: OrderDocuments;
  assigned_to: OrderNamedRef | null;
  created_by: OrderNamedRef | null;
  processed_by: OrderNamedRef | null;
  held_by: OrderNamedRef | null;
  sent_for_authentication_by: OrderNamedRef | null;
  final_contract_uploaded_by: OrderNamedRef | null;
  paid_by: OrderNamedRef | null;
  cancelled_by: OrderNamedRef | null;
  refund_requested_by: OrderNamedRef | null;
  refund_decided_by: OrderNamedRef | null;
  activities: OrderActivity[];
  created_at: string;
  updated_at: string;
};

export type OrderListResponse = {
  success: boolean;
  message: string;
  data: {
    lists: OrderListItem[];
  };
};

export type OrderDetailResponse = {
  success: boolean;
  message: string;
  data: OrderDetail;
};

export type NewOrderRow = MockOrder & {
  createdAtIso: string;
  executionDateIso: string;
};

/** Backend hold-reason slugs from `/admin/renewal-requests/hold-reasons`. */
export type HoldReasonValue =
  | "employer_data_incomplete"
  | "worker_data_unclear"
  | "missing_document"
  | "unclear_document"
  | "data_conflict"
  | "other";

export type HoldReason = {
  value: HoldReasonValue;
  label: string;
};

export type HoldReasonsResponse = {
  success: boolean;
  message: string;
  data: HoldReason[];
};

/** @alias of HoldReasonValue — used by pending filters/UI. */
export type SuspensionReason = HoldReasonValue;

export type PendingOrderRow = {
  id: string;
  orderNumber: string;
  employerName: string;
  employerPhone: string;
  workerName: string;
  createdDate: string;
  createdTime: string;
  createdAtIso: string;
  suspensionReason: HoldReasonValue;
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
  suspensionReason: "all" | HoldReasonValue;
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

export type PaymentMethod = "online" | "manual";

export type CompletedOrderRow = {
  id: string;
  orderNumber: string;
  employerName: string;
  employerPhone: string;
  workerName: string;
  createdDate: string;
  createdTime: string;
  createdAtIso: string;
  contractUploadedDate: string;
  contractUploadedTime: string;
  contractUploadedAtIso: string;
  paidDate: string;
  paidTime: string;
  paidAtIso: string;
  paymentMethod: PaymentMethod;
  dueFees: number;
  deliveryStatus: DeliveryStatus;
  source: OrderSource;
};

export type CompletedOrdersFilterValues = {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  search: string;
  orderType: "all" | OrderSource;
  paymentMethod: "all" | PaymentMethod;
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
  /** Present when the attached file is the reason the order was held. */
  issue?: "unclear" | null;
};

/** Hold details surfaced on the review page of a held order. */
export type OrderHoldInfo = {
  reason: HoldReasonValue | null;
  reasonLabel: string;
  notes: string | null;
  heldByName: string;
  heldByInitials: string;
  heldByAvatarUrl?: string;
  heldAtDateLabel: string;
  heldAtTimeLabel: string;
  relativeTimeLabel?: string;
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
  status: OrderStatus;
  statusLabel: string;
  assignee: string;
  createdAtLabel: string;
  createdTimeLabel: string;
  relativeTimeLabel: string;
  hold: OrderHoldInfo | null;
  changeHistory: ChangeHistoryRow[];
  documents: OrderDocument[];
};
