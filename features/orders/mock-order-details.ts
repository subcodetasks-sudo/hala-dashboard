import type {
  OrderActivity,
  OrderDetail,
  OrderDocuments,
  OrderEmployer,
  OrderNamedRef,
  OrderPlan,
  OrderRefundMethod,
  OrderRefundStatus,
  OrderStatus,
  OrderWorker,
} from "@/features/orders/types";

/**
 * Temporary mock renewal-request details shaped like
 * `GET /admin/renewal-requests/:id` (`OrderDetail`).
 * String keys are intentional so they never collide with real DB numeric ids.
 */
const ADMIN: OrderNamedRef = {
  id: 42,
  name: "Rayan Al-Turki",
  name_ar: "ريان التركي",
  name_en: "Rayan Al-Turki",
};

const BASIC_RENEWAL_PLAN: OrderPlan = {
  id: 1,
  title_ar: "باقة التجديد الأساسية",
  title_en: "Basic Renewal Plan",
  price: 299,
  type: "plan_renewal",
};

const CITY_RIYADH = {
  id: 1,
  name_ar: "الرياض",
  name_en: "Riyadh",
};

const PASSPORT_PLACE = {
  id: 1,
  name_ar: "مانيلا",
  name_en: "Manila",
};

const BASE_DOCUMENTS: OrderDocuments = {
  national_id_image: "/svg/personalcard.svg",
  iqama_image: "/svg/identity-2.svg",
  passport_image: "/svg/document-text.svg",
  exit_reentry_visa: "/svg/receipt-item.svg",
  employer_signature: "/svg/brush.svg",
  worker_signature: "/svg/brush.svg",
  salary: null,
};

const BASE_EMPLOYER: OrderEmployer = {
  employer_name_ar: "عبد الله القحطاني",
  employer_name_en: "Abdullah Al-Qahtani",
  national_id: "1098765432",
  phone: "+966514111001",
  city_id: CITY_RIYADH.id,
  city: CITY_RIYADH,
  passport_issue_place_id: PASSPORT_PLACE.id,
  passport_issue_place: PASSPORT_PLACE,
};

const BASE_WORKER: OrderWorker = {
  worker_name_ar: "ياسين الظهراني",
  worker_name_en: "Yassin Al-Nahrani",
  worker_phone: "+966550111222",
  birth_date: "1992-04-18",
  philippines_address: "123 Mabini St, Manila, Philippines",
  passport_issue_place_id: PASSPORT_PLACE.id,
  passport_issue_place: PASSPORT_PLACE,
  passport_number: "P1234567A",
  passport_issue_date: "2020-01-15",
  passport_expiry_date: "2030-01-14",
};

function activity(
  id: number,
  action: string,
  actionLabel: string,
  createdAt: string,
  description?: string,
): OrderActivity {
  return {
    id,
    action,
    action_label: actionLabel,
    description: description ?? actionLabel,
    meta: null,
    notes: null,
    created_at: createdAt,
    admin: ADMIN,
    performed_by: ADMIN,
  };
}

type MockDetailSeed = {
  mockId: string;
  numericId: number;
  requestNumber: string;
  status: OrderStatus;
  statusLabel: string;
  source: "e_form" | "manual";
  sourceLabel: string;
  createdAt: string;
  updatedAt: string;
  expectedCompletionDate: string;
  submittedAt: string;
  reviewStartedAt: string;
  processedAt: string;
  sentForAuthenticationAt: string;
  finalContractUploadedAt: string;
  paidAt: string | null;
  paymentType: "online" | "manual" | null;
  paymentTypeLabel: string | null;
  deliveryRequired: boolean;
  deliveryStatus: OrderDetail["delivery_status"];
  deliveryStatusLabel: string;
  serviceFee: string;
  deliveryFee: string;
  totalFee: string;
  linkedToRefund: boolean;
  refundStatus: OrderRefundStatus | null;
  refundStatusLabel: string | null;
  refundMethod: OrderRefundMethod | null;
  refundMethodLabel: string | null;
  refundAmount: string | null;
  refundReason: string | null;
  refundRequestedAt: string | null;
  refundDecidedAt: string | null;
  canApproveRefund: boolean;
  canRejectRefund: boolean;
  employer?: Partial<OrderEmployer>;
  worker?: Partial<OrderWorker>;
  activities: OrderActivity[];
};

function buildDetail(seed: MockDetailSeed): OrderDetail {
  return {
    id: seed.numericId,
    request_number: seed.requestNumber,
    current_step: seed.status === "awaiting_payment" ? 6 : 7,
    status: seed.status,
    status_label: seed.statusLabel,
    source: seed.source,
    source_label: seed.sourceLabel,
    is_submitted: true,
    submitted_at: seed.submittedAt,
    expected_completion_date: seed.expectedCompletionDate,
    review_started_at: seed.reviewStartedAt,
    processed_at: seed.processedAt,
    held_at: null,
    hold_reason: null,
    hold_reason_label: null,
    hold_notes: null,
    contract_number: `CNT-${seed.numericId}`,
    contract_qr_code:
      seed.status === "completed"
        ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CNT-${seed.numericId}`
        : null,
    contract_generated_at: seed.processedAt,
    contract_url: "/svg/receipt-2.svg",
    sent_for_authentication_at: seed.sentForAuthenticationAt,
    final_contract_uploaded_at: seed.finalContractUploadedAt,
    has_final_contract: true,
    final_contract_url: "/svg/receipt-item.svg",
    delivery_required: seed.deliveryRequired,
    delivery_status: seed.deliveryStatus,
    delivery_status_label: seed.deliveryStatusLabel,
    service_fee: seed.serviceFee,
    delivery_fee: seed.deliveryFee,
    total_fee: seed.totalFee,
    plan_id: seed.status === "completed" ? BASIC_RENEWAL_PLAN.id : null,
    plan: seed.status === "completed" ? BASIC_RENEWAL_PLAN : null,
    payment_type: seed.paymentType,
    payment_type_label: seed.paymentTypeLabel,
    paid_at: seed.paidAt,
    payment_notification_text: null,
    payment_proof_url: seed.paidAt ? "/svg/receipt-2.svg" : null,
    cancellation_reason: null,
    cancellation_reason_label: null,
    cancellation_source: null,
    cancellation_source_label: null,
    cancellation_notes: null,
    cancelled_status_before: null,
    cancelled_status_before_label: null,
    cancelled_at: null,
    linked_to_refund: seed.linkedToRefund,
    is_frozen: seed.linkedToRefund,
    refund_status: seed.refundStatus,
    refund_status_label: seed.refundStatusLabel,
    refund_method: seed.refundMethod,
    refund_method_label: seed.refundMethodLabel,
    refund_amount: seed.refundAmount,
    refund_reason: seed.refundReason,
    refund_requested_at: seed.refundRequestedAt,
    refund_decided_at: seed.refundDecidedAt,
    refund_rejection_reason: null,
    can_approve_refund: seed.canApproveRefund,
    can_reject_refund: seed.canRejectRefund,
    employer: { ...BASE_EMPLOYER, ...seed.employer },
    worker: { ...BASE_WORKER, ...seed.worker },
    documents: BASE_DOCUMENTS,
    assigned_to: ADMIN,
    created_by: ADMIN,
    processed_by: ADMIN,
    held_by: null,
    sent_for_authentication_by: ADMIN,
    final_contract_uploaded_by: ADMIN,
    paid_by: seed.paidAt ? ADMIN : null,
    cancelled_by: null,
    refund_requested_by: seed.linkedToRefund ? ADMIN : null,
    refund_decided_by:
      seed.refundStatus === "completed" || seed.refundStatus === "approved"
        ? ADMIN
        : null,
    activities: seed.activities,
    created_at: seed.createdAt,
    updated_at: seed.updatedAt,
  };
}

const AWAITING_PAYMENT_SEEDS: MockDetailSeed[] = [
  {
    mockId: "mock-pay-900001",
    numericId: 900001,
    requestNumber: "#ORD-PAY-01",
    status: "awaiting_payment",
    statusLabel: "Awaiting Payment",
    source: "e_form",
    sourceLabel: "E-Form",
    createdAt: "2026-01-12T07:30:00.000000Z",
    updatedAt: "2026-01-14T08:00:00.000000Z",
    expectedCompletionDate: "2026-01-25",
    submittedAt: "2026-01-12T07:35:00.000000Z",
    reviewStartedAt: "2026-01-12T09:00:00.000000Z",
    processedAt: "2026-01-13T11:15:00.000000Z",
    sentForAuthenticationAt: "2026-01-13T14:00:00.000000Z",
    finalContractUploadedAt: "2026-01-14T08:00:00.000000Z",
    paidAt: null,
    paymentType: null,
    paymentTypeLabel: null,
    deliveryRequired: true,
    deliveryStatus: "required",
    deliveryStatusLabel: "Required",
    serviceFee: "200.00",
    deliveryFee: "50.00",
    totalFee: "250.00",
    linkedToRefund: false,
    refundStatus: null,
    refundStatusLabel: null,
    refundMethod: null,
    refundMethodLabel: null,
    refundAmount: null,
    refundReason: null,
    refundRequestedAt: null,
    refundDecidedAt: null,
    canApproveRefund: false,
    canRejectRefund: false,
    activities: [
      activity(1, "created", "Order created", "2026-01-12T07:30:00.000000Z"),
      activity(2, "processed", "Order processed", "2026-01-13T11:15:00.000000Z"),
      activity(
        3,
        "final_contract_uploaded",
        "Final contract uploaded",
        "2026-01-14T08:00:00.000000Z",
      ),
      activity(
        4,
        "awaiting_payment",
        "Moved to awaiting payment",
        "2026-01-14T08:05:00.000000Z",
      ),
    ],
  },
  {
    mockId: "mock-pay-900002",
    numericId: 900002,
    requestNumber: "#ORD-PAY-02",
    status: "awaiting_payment",
    statusLabel: "Awaiting Payment",
    source: "manual",
    sourceLabel: "Manual",
    createdAt: "2026-01-11T06:20:00.000000Z",
    updatedAt: "2026-01-13T13:30:00.000000Z",
    expectedCompletionDate: "2026-01-24",
    submittedAt: "2026-01-11T06:25:00.000000Z",
    reviewStartedAt: "2026-01-11T08:00:00.000000Z",
    processedAt: "2026-01-12T10:40:00.000000Z",
    sentForAuthenticationAt: "2026-01-12T15:00:00.000000Z",
    finalContractUploadedAt: "2026-01-13T13:30:00.000000Z",
    paidAt: null,
    paymentType: null,
    paymentTypeLabel: null,
    deliveryRequired: false,
    deliveryStatus: "not_required",
    deliveryStatusLabel: "Not Required",
    serviceFee: "250.00",
    deliveryFee: "0.00",
    totalFee: "250.00",
    linkedToRefund: false,
    refundStatus: null,
    refundStatusLabel: null,
    refundMethod: null,
    refundMethodLabel: null,
    refundAmount: null,
    refundReason: null,
    refundRequestedAt: null,
    refundDecidedAt: null,
    canApproveRefund: false,
    canRejectRefund: false,
    employer: {
      employer_name_ar: "سارة المطيري",
      employer_name_en: "Sara Al-Mutairi",
      national_id: "1087654321",
      phone: "+966550222033",
    },
    worker: {
      worker_name_ar: "ماريا سانتوس",
      worker_name_en: "Maria Santos",
      worker_phone: "+966551222333",
      passport_number: "P7654321B",
    },
    activities: [
      activity(11, "created", "Order created", "2026-01-11T06:20:00.000000Z"),
      activity(
        12,
        "awaiting_payment",
        "Moved to awaiting payment",
        "2026-01-13T13:35:00.000000Z",
      ),
    ],
  },
];

const COMPLETED_SEEDS: MockDetailSeed[] = [
  {
    mockId: "mock-cmp-900101",
    numericId: 900101,
    requestNumber: "#ORD-CMP-01",
    status: "completed",
    statusLabel: "Completed",
    source: "e_form",
    sourceLabel: "E-Form",
    createdAt: "2026-01-12T07:30:00.000000Z",
    updatedAt: "2026-01-15T06:20:00.000000Z",
    expectedCompletionDate: "2026-01-25",
    submittedAt: "2026-01-12T07:35:00.000000Z",
    reviewStartedAt: "2026-01-12T09:00:00.000000Z",
    processedAt: "2026-01-13T11:15:00.000000Z",
    sentForAuthenticationAt: "2026-01-13T14:00:00.000000Z",
    finalContractUploadedAt: "2026-01-14T08:00:00.000000Z",
    paidAt: "2026-01-15T06:20:00.000000Z",
    paymentType: "online",
    paymentTypeLabel: "Online",
    deliveryRequired: true,
    deliveryStatus: "required",
    deliveryStatusLabel: "Required",
    serviceFee: "200.00",
    deliveryFee: "50.00",
    totalFee: "250.00",
    linkedToRefund: false,
    refundStatus: null,
    refundStatusLabel: null,
    refundMethod: null,
    refundMethodLabel: null,
    refundAmount: null,
    refundReason: null,
    refundRequestedAt: null,
    refundDecidedAt: null,
    canApproveRefund: false,
    canRejectRefund: false,
    activities: [
      activity(21, "created", "Order created", "2026-01-12T07:30:00.000000Z"),
      activity(22, "processed", "Order processed", "2026-01-13T11:15:00.000000Z"),
      activity(23, "paid", "Payment confirmed", "2026-01-15T06:20:00.000000Z"),
      activity(24, "completed", "Order completed", "2026-01-15T06:21:00.000000Z"),
    ],
  },
  {
    mockId: "mock-cmp-900102",
    numericId: 900102,
    requestNumber: "#ORD-CMP-02",
    status: "completed",
    statusLabel: "Completed",
    source: "manual",
    sourceLabel: "Manual",
    createdAt: "2026-01-11T06:20:00.000000Z",
    updatedAt: "2026-01-14T11:10:00.000000Z",
    expectedCompletionDate: "2026-01-24",
    submittedAt: "2026-01-11T06:25:00.000000Z",
    reviewStartedAt: "2026-01-11T08:00:00.000000Z",
    processedAt: "2026-01-12T10:40:00.000000Z",
    sentForAuthenticationAt: "2026-01-12T15:00:00.000000Z",
    finalContractUploadedAt: "2026-01-13T13:30:00.000000Z",
    paidAt: "2026-01-14T11:10:00.000000Z",
    paymentType: "manual",
    paymentTypeLabel: "Manual",
    deliveryRequired: false,
    deliveryStatus: "not_required",
    deliveryStatusLabel: "Not Required",
    serviceFee: "250.00",
    deliveryFee: "0.00",
    totalFee: "250.00",
    linkedToRefund: false,
    refundStatus: null,
    refundStatusLabel: null,
    refundMethod: null,
    refundMethodLabel: null,
    refundAmount: null,
    refundReason: null,
    refundRequestedAt: null,
    refundDecidedAt: null,
    canApproveRefund: false,
    canRejectRefund: false,
    employer: {
      employer_name_ar: "سارة المطيري",
      employer_name_en: "Sara Al-Mutairi",
      national_id: "1087654321",
      phone: "+966550222033",
    },
    worker: {
      worker_name_ar: "ماريا سانتوس",
      worker_name_en: "Maria Santos",
      passport_number: "P7654321B",
    },
    activities: [
      activity(31, "created", "Order created", "2026-01-11T06:20:00.000000Z"),
      activity(32, "paid", "Payment confirmed", "2026-01-14T11:10:00.000000Z"),
      activity(33, "completed", "Order completed", "2026-01-14T11:11:00.000000Z"),
    ],
  },
];

const REFUND_SEEDS: MockDetailSeed[] = [
  {
    mockId: "refund-mock-01",
    numericId: 900201,
    requestNumber: "#ORD-RFD-01",
    status: "completed",
    statusLabel: "Completed",
    source: "e_form",
    sourceLabel: "E-Form",
    createdAt: "2026-01-05T07:30:00.000000Z",
    updatedAt: "2026-01-12T07:30:00.000000Z",
    expectedCompletionDate: "2026-01-20",
    submittedAt: "2026-01-05T07:35:00.000000Z",
    reviewStartedAt: "2026-01-05T09:00:00.000000Z",
    processedAt: "2026-01-06T11:15:00.000000Z",
    sentForAuthenticationAt: "2026-01-06T14:00:00.000000Z",
    finalContractUploadedAt: "2026-01-07T08:00:00.000000Z",
    paidAt: "2026-01-08T06:20:00.000000Z",
    paymentType: "online",
    paymentTypeLabel: "Online",
    deliveryRequired: true,
    deliveryStatus: "required",
    deliveryStatusLabel: "Required",
    serviceFee: "200.00",
    deliveryFee: "50.00",
    totalFee: "250.00",
    linkedToRefund: true,
    refundStatus: "pending",
    refundStatusLabel: "Pending",
    refundMethod: "bank_transfer",
    refundMethodLabel: "Bank Transfer",
    refundAmount: "250.00",
    refundReason: "Order cancelled after payment",
    refundRequestedAt: "2026-01-12T07:30:00.000000Z",
    refundDecidedAt: null,
    canApproveRefund: true,
    canRejectRefund: true,
    activities: [
      activity(41, "completed", "Order completed", "2026-01-08T06:21:00.000000Z"),
      activity(
        42,
        "refund_requested",
        "Refund requested",
        "2026-01-12T07:30:00.000000Z",
        "Refund requested: Order cancelled after payment",
      ),
    ],
  },
  {
    mockId: "refund-mock-06",
    numericId: 900206,
    requestNumber: "#ORD-RFD-06",
    status: "completed",
    statusLabel: "Completed",
    source: "manual",
    sourceLabel: "Manual",
    createdAt: "2026-01-04T07:30:00.000000Z",
    updatedAt: "2026-01-13T10:00:00.000000Z",
    expectedCompletionDate: "2026-01-18",
    submittedAt: "2026-01-04T07:35:00.000000Z",
    reviewStartedAt: "2026-01-04T09:00:00.000000Z",
    processedAt: "2026-01-05T11:15:00.000000Z",
    sentForAuthenticationAt: "2026-01-05T14:00:00.000000Z",
    finalContractUploadedAt: "2026-01-06T08:00:00.000000Z",
    paidAt: "2026-01-07T06:20:00.000000Z",
    paymentType: "manual",
    paymentTypeLabel: "Manual",
    deliveryRequired: false,
    deliveryStatus: "not_required",
    deliveryStatusLabel: "Not Required",
    serviceFee: "250.00",
    deliveryFee: "0.00",
    totalFee: "250.00",
    linkedToRefund: true,
    refundStatus: "completed",
    refundStatusLabel: "Completed",
    refundMethod: "bank_transfer",
    refundMethodLabel: "Bank Transfer",
    refundAmount: "250.00",
    refundReason: "Order cancelled after payment",
    refundRequestedAt: "2026-01-10T07:30:00.000000Z",
    refundDecidedAt: "2026-01-13T10:00:00.000000Z",
    canApproveRefund: false,
    canRejectRefund: false,
    activities: [
      activity(51, "completed", "Order completed", "2026-01-07T06:21:00.000000Z"),
      activity(
        52,
        "refund_requested",
        "Refund requested",
        "2026-01-10T07:30:00.000000Z",
      ),
      activity(
        53,
        "refund_completed",
        "Refund completed",
        "2026-01-13T10:00:00.000000Z",
      ),
    ],
  },
];

/** Extra payment / completed list rows that open the same shape of detail. */
function clonePaymentSeed(
  index: number,
  overrides: Partial<MockDetailSeed> & Pick<MockDetailSeed, "mockId" | "numericId" | "requestNumber">,
): MockDetailSeed {
  const base = AWAITING_PAYMENT_SEEDS[index % AWAITING_PAYMENT_SEEDS.length];
  return {
    ...base,
    ...overrides,
    activities: base.activities.map((row, i) => ({
      ...row,
      id: overrides.numericId * 10 + i,
    })),
  };
}

function cloneCompletedSeed(
  index: number,
  overrides: Partial<MockDetailSeed> & Pick<MockDetailSeed, "mockId" | "numericId" | "requestNumber">,
): MockDetailSeed {
  const base = COMPLETED_SEEDS[index % COMPLETED_SEEDS.length];
  return {
    ...base,
    ...overrides,
    activities: base.activities.map((row, i) => ({
      ...row,
      id: overrides.numericId * 10 + i,
    })),
  };
}

function cloneRefundSeed(
  index: number,
  overrides: Partial<MockDetailSeed> & Pick<MockDetailSeed, "mockId" | "numericId" | "requestNumber">,
): MockDetailSeed {
  const base = REFUND_SEEDS[index % REFUND_SEEDS.length];
  return {
    ...base,
    ...overrides,
    activities: base.activities.map((row, i) => ({
      ...row,
      id: overrides.numericId * 10 + i,
    })),
  };
}

const EXTRA_PAYMENT_SEEDS: MockDetailSeed[] = [
  clonePaymentSeed(0, {
    mockId: "mock-pay-900003",
    numericId: 900003,
    requestNumber: "#ORD-PAY-03",
  }),
  clonePaymentSeed(1, {
    mockId: "mock-pay-900004",
    numericId: 900004,
    requestNumber: "#ORD-PAY-04",
  }),
  clonePaymentSeed(0, {
    mockId: "mock-pay-900005",
    numericId: 900005,
    requestNumber: "#ORD-PAY-05",
  }),
  clonePaymentSeed(1, {
    mockId: "mock-pay-900006",
    numericId: 900006,
    requestNumber: "#ORD-PAY-06",
  }),
  clonePaymentSeed(0, {
    mockId: "mock-pay-900007",
    numericId: 900007,
    requestNumber: "#ORD-PAY-07",
  }),
  clonePaymentSeed(1, {
    mockId: "mock-pay-900008",
    numericId: 900008,
    requestNumber: "#ORD-PAY-08",
  }),
];

const EXTRA_COMPLETED_SEEDS: MockDetailSeed[] = [
  cloneCompletedSeed(0, {
    mockId: "mock-cmp-900103",
    numericId: 900103,
    requestNumber: "#ORD-CMP-03",
  }),
  cloneCompletedSeed(1, {
    mockId: "mock-cmp-900104",
    numericId: 900104,
    requestNumber: "#ORD-CMP-04",
  }),
  cloneCompletedSeed(0, {
    mockId: "mock-cmp-900105",
    numericId: 900105,
    requestNumber: "#ORD-CMP-05",
  }),
  cloneCompletedSeed(1, {
    mockId: "mock-cmp-900106",
    numericId: 900106,
    requestNumber: "#ORD-CMP-06",
  }),
  cloneCompletedSeed(0, {
    mockId: "mock-cmp-900107",
    numericId: 900107,
    requestNumber: "#ORD-CMP-07",
  }),
  cloneCompletedSeed(1, {
    mockId: "mock-cmp-900108",
    numericId: 900108,
    requestNumber: "#ORD-CMP-08",
  }),
];

const EXTRA_REFUND_SEEDS: MockDetailSeed[] = [
  cloneRefundSeed(0, {
    mockId: "refund-mock-02",
    numericId: 900202,
    requestNumber: "#ORD-RFD-02",
    refundMethod: "wallet",
    refundMethodLabel: "Wallet",
  }),
  cloneRefundSeed(0, {
    mockId: "refund-mock-03",
    numericId: 900203,
    requestNumber: "#ORD-RFD-03",
    refundMethod: "cash",
    refundMethodLabel: "Cash",
  }),
  cloneRefundSeed(0, {
    mockId: "refund-mock-04",
    numericId: 900204,
    requestNumber: "#ORD-RFD-04",
    source: "manual",
    sourceLabel: "Manual",
  }),
  cloneRefundSeed(0, {
    mockId: "refund-mock-05",
    numericId: 900205,
    requestNumber: "#ORD-RFD-05",
    refundMethod: "wallet",
    refundMethodLabel: "Wallet",
  }),
  cloneRefundSeed(1, {
    mockId: "refund-mock-07",
    numericId: 900207,
    requestNumber: "#ORD-RFD-07",
    refundMethod: "cash",
    refundMethodLabel: "Cash",
  }),
  cloneRefundSeed(1, {
    mockId: "refund-mock-08",
    numericId: 900208,
    requestNumber: "#ORD-RFD-08",
    refundMethod: "wallet",
    refundMethodLabel: "Wallet",
  }),
];

const ALL_SEEDS: MockDetailSeed[] = [
  ...AWAITING_PAYMENT_SEEDS,
  ...EXTRA_PAYMENT_SEEDS,
  ...COMPLETED_SEEDS,
  ...EXTRA_COMPLETED_SEEDS,
  ...REFUND_SEEDS,
  ...EXTRA_REFUND_SEEDS,
];

/** Map of unique mock string ids → full API-shaped order detail. */
export const MOCK_ORDER_DETAILS: Record<string, OrderDetail> = Object.fromEntries(
  ALL_SEEDS.map((seed) => [seed.mockId, buildDetail(seed)]),
);

export function isMockOrderDetailId(id: string): boolean {
  return id in MOCK_ORDER_DETAILS;
}

export function getMockOrderDetail(id: string): OrderDetail | null {
  return MOCK_ORDER_DETAILS[id] ?? null;
}

export const MOCK_PAYMENT_ORDER_IDS = ALL_SEEDS.filter(
  (s) => s.status === "awaiting_payment",
).map((s) => s.mockId);

export const MOCK_COMPLETED_ORDER_IDS = ALL_SEEDS.filter(
  (s) => s.status === "completed" && !s.linkedToRefund,
).map((s) => s.mockId);

export const MOCK_REFUND_ORDER_IDS = ALL_SEEDS.filter((s) => s.linkedToRefund).map(
  (s) => s.mockId,
);
