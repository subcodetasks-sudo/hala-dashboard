import type {
  HoldReasonValue,
  OrderDetail,
  OrderDocumentType,
  OrderHoldInfo,
  OrderListItem,
  OrderNamedRef,
  OrderReviewDetail,
  OrderSource,
  OrderStatus,
} from "@/features/orders/types";

const STORAGE = "https://hala.subcodeco.com/storage";

const STAFF: Record<string, OrderNamedRef> = {
  sara: { id: 1, name_ar: "سارة أحمد", name_en: "Sara Ahmed" },
  fahad: { id: 2, name_ar: "فهد العتيبي", name_en: "Fahad Alotaibi" },
  noura: { id: 3, name_ar: "نورة صالح", name_en: "Noura Saleh" },
  khalid: { id: 4, name_ar: "خالد العتيبي", name_en: "Khalid Alotaibi" },
};

/** Detail endpoints return admins as `{ id, name }` only. */
const SUPER_ADMIN: OrderNamedRef = { id: 1, name: "Super Admin" };

const STATUS_LABELS: Record<OrderStatus, { en: string; ar: string }> = {
  draft: { en: "Draft", ar: "مسودة" },
  new: { en: "New", ar: "جديد" },
  under_review: { en: "Under review", ar: "قيد المراجعة" },
  processed: { en: "Processed", ar: "تمت المعالجة" },
  held: { en: "On hold", ar: "معلق" },
  sent_for_authentication: {
    en: "Sent for authentication",
    ar: "تم الإرسال للمصادقة",
  },
  awaiting_payment: { en: "Awaiting payment", ar: "مرحلة الدفع" },
  completed: { en: "Completed", ar: "مكتمل" },
  cancelled: { en: "Cancelled", ar: "ملغى" },
};

function statusLabel(status: OrderStatus, locale: "en" | "ar" = "en") {
  return STATUS_LABELS[status][locale];
}

function baseListItem(
  overrides: Partial<OrderListItem> &
    Pick<OrderListItem, "id" | "status" | "created_at">
): OrderListItem {
  const { status_label: overrideLabel, ...rest } = overrides;
  return {
    request_number: null,
    employer_name_ar: "شركة هلا",
    employer_name_en: "Hala Company",
    phone: "0501234567",
    worker_name_ar: null,
    worker_name_en: null,
    source: "e_form",
    source_label: "E-form",
    contract_number: null,
    hold_reason: null,
    hold_reason_label: null,
    hold_notes: null,
    held_at: null,
    expected_completion_date: null,
    delivery_required: false,
    delivery_status: "not_required",
    delivery_status_label: "Not required",
    service_fee: null,
    delivery_fee: null,
    total_fee: null,
    payment_type: null,
    payment_type_label: null,
    paid_at: null,
    submitted_at: null,
    processed_at: null,
    sent_for_authentication_at: null,
    final_contract_uploaded_at: null,
    has_final_contract: false,
    final_contract_url: null,
    payment_proof_url: null,
    cancellation_reason: null,
    cancellation_reason_label: null,
    cancellation_source: null,
    cancellation_source_label: null,
    cancellation_notes: null,
    cancelled_status_before: null,
    cancelled_at: null,
    linked_to_refund: false,
    refund_status: null,
    refund_status_label: null,
    refund_method: null,
    refund_method_label: null,
    refund_amount: null,
    refund_reason: null,
    refund_requested_at: null,
    refund_decided_at: null,
    refund_rejection_reason: null,
    assigned_to: null,
    processed_by: null,
    held_by: null,
    cancelled_by: null,
    ...rest,
    status_label: overrideLabel ?? statusLabel(overrides.status),
  };
}

/** One list row per backend status, plus variants (source / delivery / refund). */
export const MOCK_ORDER_LIST: OrderListItem[] = [
  baseListItem({
    id: 1,
    status: "draft",
    request_number: null,
    worker_name_ar: null,
    worker_name_en: null,
    created_at: "2026-07-29 09:58:05",
  }),
  baseListItem({
    id: 2,
    status: "new",
    request_number: "REQ-2026-0002",
    employer_name_ar: "عبدالله القحطاني",
    employer_name_en: "Abdullah Al-Qahtani",
    phone: "0550666012",
    worker_name_ar: "ماريا سانتوس",
    worker_name_en: "Maria Santos",
    source: "manual",
    source_label: "Manual",
    submitted_at: "2026-07-28 11:20:00",
    expected_completion_date: "2026-08-15",
    assigned_to: STAFF.sara,
    created_at: "2026-07-28 10:05:00",
  }),
  baseListItem({
    id: 3,
    status: "under_review",
    request_number: "REQ-2026-0003",
    employer_name_ar: "سارة المطيري",
    employer_name_en: "Sara Al-Mutairi",
    phone: "0530333044",
    worker_name_ar: "خوان ديلا كروز",
    worker_name_en: "Juan Dela Cruz",
    submitted_at: "2026-07-27 09:00:00",
    expected_completion_date: "2026-08-10",
    assigned_to: STAFF.fahad,
    created_at: "2026-07-27 08:40:00",
  }),
  baseListItem({
    id: 4,
    status: "processed",
    request_number: "REQ-2026-0004",
    employer_name_ar: "فهد العتيبي",
    employer_name_en: "Fahad Alotaibi",
    phone: "0520444055",
    worker_name_ar: "آنا رييس",
    worker_name_en: "Ana Reyes",
    contract_number: "CNT-88421",
    submitted_at: "2026-07-20 14:10:00",
    processed_at: "2026-07-22 16:30:00",
    expected_completion_date: "2026-08-05",
    assigned_to: STAFF.noura,
    processed_by: STAFF.noura,
    created_at: "2026-07-20 13:55:00",
  }),
  baseListItem({
    id: 5,
    status: "held",
    request_number: "REQ-2026-0005",
    employer_name_ar: "مها الحربي",
    employer_name_en: "Maha Alharbi",
    phone: "0509777033",
    worker_name_ar: "خوسيه غارسيا",
    worker_name_en: "Jose Garcia",
    hold_reason: "missing_document",
    hold_reason_label: "Missing document",
    hold_notes: "Passport first page is unclear.",
    held_at: "2026-07-25 12:15:00",
    held_by: STAFF.khalid,
    assigned_to: STAFF.khalid,
    submitted_at: "2026-07-24 09:30:00",
    created_at: "2026-07-24 09:00:00",
  }),
  baseListItem({
    id: 6,
    status: "sent_for_authentication",
    request_number: "REQ-2026-0006",
    employer_name_ar: "نورة صالح",
    employer_name_en: "Noura Saleh",
    phone: "0540111001",
    worker_name_ar: "ليزا كروز",
    worker_name_en: "Lisa Cruz",
    contract_number: "CNT-88455",
    submitted_at: "2026-07-18 10:00:00",
    processed_at: "2026-07-19 11:20:00",
    sent_for_authentication_at: "2026-07-21 09:45:00",
    expected_completion_date: "2026-08-01",
    assigned_to: STAFF.sara,
    processed_by: STAFF.fahad,
    created_at: "2026-07-18 09:30:00",
  }),
  baseListItem({
    id: 7,
    status: "awaiting_payment",
    request_number: "REQ-2026-0007",
    employer_name_ar: "خالد العتيبي",
    employer_name_en: "Khalid Alotaibi",
    phone: "0551222033",
    worker_name_ar: "بيتر سانتوس",
    worker_name_en: "Peter Santos",
    contract_number: "CNT-88501",
    delivery_required: true,
    delivery_status: "pending",
    delivery_status_label: "Pending",
    service_fee: "250.00",
    delivery_fee: "50.00",
    total_fee: "300.00",
    has_final_contract: true,
    final_contract_url: `${STORAGE}/contracts/cnt-88501.pdf`,
    final_contract_uploaded_at: "2026-07-23 15:00:00",
    submitted_at: "2026-07-15 08:00:00",
    processed_at: "2026-07-16 10:00:00",
    sent_for_authentication_at: "2026-07-17 11:00:00",
    assigned_to: STAFF.noura,
    processed_by: STAFF.sara,
    created_at: "2026-07-15 07:45:00",
  }),
  baseListItem({
    id: 8,
    status: "completed",
    request_number: "REQ-2026-0008",
    employer_name_ar: "هدى منصور",
    employer_name_en: "Huda Mansour",
    phone: "0533444555",
    worker_name_ar: "كارمن ديلا",
    worker_name_en: "Carmen Dela",
    contract_number: "CNT-88610",
    delivery_required: true,
    delivery_status: "delivered",
    delivery_status_label: "Delivered",
    service_fee: "250.00",
    delivery_fee: "50.00",
    total_fee: "300.00",
    payment_type: "online",
    payment_type_label: "Online",
    paid_at: "2026-07-14 13:20:00",
    has_final_contract: true,
    final_contract_url: `${STORAGE}/contracts/cnt-88610.pdf`,
    final_contract_uploaded_at: "2026-07-12 16:00:00",
    payment_proof_url: `${STORAGE}/payments/proof-88610.png`,
    submitted_at: "2026-07-08 09:00:00",
    processed_at: "2026-07-09 11:00:00",
    sent_for_authentication_at: "2026-07-10 10:00:00",
    assigned_to: STAFF.fahad,
    processed_by: STAFF.khalid,
    created_at: "2026-07-08 08:30:00",
  }),
  baseListItem({
    id: 9,
    status: "cancelled",
    request_number: "REQ-2026-0009",
    employer_name_ar: "يوسف إبراهيم",
    employer_name_en: "Yousef Ibrahim",
    phone: "0509888777",
    worker_name_ar: "روزا ميندوزا",
    worker_name_en: "Rosa Mendoza",
    source: "manual",
    source_label: "Manual",
    cancellation_reason: "customer_request",
    cancellation_reason_label: "Customer request",
    cancellation_source: "admin",
    cancellation_source_label: "Admin",
    cancellation_notes: "Employer requested cancellation before review.",
    cancelled_status_before: "new",
    cancelled_at: "2026-07-26 17:00:00",
    cancelled_by: STAFF.sara,
    submitted_at: "2026-07-26 10:00:00",
    created_at: "2026-07-26 09:40:00",
  }),
  baseListItem({
    id: 10,
    status: "cancelled",
    request_number: "REQ-2026-0010",
    employer_name_ar: "أحمد بن خالد",
    employer_name_en: "Ahmed bin Khalid",
    phone: "0545666777",
    worker_name_ar: "ميغيل لوبيز",
    worker_name_en: "Miguel Lopez",
    contract_number: "CNT-88700",
    cancellation_reason: "payment_timeout",
    cancellation_reason_label: "Payment timeout",
    cancellation_source: "system",
    cancellation_source_label: "System",
    cancelled_status_before: "awaiting_payment",
    cancelled_at: "2026-07-20 23:59:00",
    linked_to_refund: true,
    refund_status: "pending",
    refund_status_label: "Pending",
    refund_method: "bank_transfer",
    refund_method_label: "Bank transfer",
    refund_amount: "300.00",
    refund_reason: "Order cancelled after payment.",
    refund_requested_at: "2026-07-21 09:00:00",
    service_fee: "250.00",
    delivery_fee: "50.00",
    total_fee: "300.00",
    payment_type: "manual",
    payment_type_label: "Manual",
    paid_at: "2026-07-18 12:00:00",
    has_final_contract: true,
    final_contract_url: `${STORAGE}/contracts/cnt-88700.pdf`,
    submitted_at: "2026-07-10 08:00:00",
    processed_at: "2026-07-11 09:00:00",
    sent_for_authentication_at: "2026-07-12 10:00:00",
    final_contract_uploaded_at: "2026-07-14 11:00:00",
    created_at: "2026-07-10 07:50:00",
  }),
];

function baseDetail(
  overrides: Partial<OrderDetail> &
    Pick<OrderDetail, "id" | "status" | "created_at" | "updated_at">
): OrderDetail {
  const { status_label: overrideLabel, ...rest } = overrides;
  return {
    request_number: null,
    current_step: 1,
    source: "e_form",
    source_label: "E-form",
    is_submitted: false,
    submitted_at: null,
    expected_completion_date: null,
    review_started_at: null,
    processed_at: null,
    held_at: null,
    hold_reason: null,
    hold_reason_label: null,
    hold_notes: null,
    contract_number: null,
    contract_qr_code: null,
    contract_generated_at: null,
    contract_url: null,
    sent_for_authentication_at: null,
    final_contract_uploaded_at: null,
    has_final_contract: false,
    final_contract_url: null,
    delivery_required: false,
    delivery_status: "not_required",
    delivery_status_label: "Not required",
    service_fee: null,
    delivery_fee: null,
    total_fee: null,
    payment_type: null,
    payment_type_label: null,
    paid_at: null,
    payment_notification_text: null,
    payment_proof_url: null,
    cancellation_reason: null,
    cancellation_reason_label: null,
    cancellation_source: null,
    cancellation_source_label: null,
    cancellation_notes: null,
    cancelled_status_before: null,
    cancelled_status_before_label: null,
    cancelled_at: null,
    linked_to_refund: false,
    is_frozen: false,
    refund_status: null,
    refund_status_label: null,
    refund_method: null,
    refund_method_label: null,
    refund_amount: null,
    refund_reason: null,
    refund_requested_at: null,
    refund_decided_at: null,
    refund_rejection_reason: null,
    can_approve_refund: false,
    can_reject_refund: false,
    employer: {
      employer_name_ar: "شركة هلا",
      employer_name_en: "Hala Company",
      national_id: "1234567890",
      phone: "0501234567",
      city_id: 64,
      city: { id: 64, name_ar: "جازان", name_en: "Jazan" },
      passport_issue_place_id: 1,
      passport_issue_place: {
        id: 1,
        name_ar: "السفارة الفلبينية - الرياض",
        name_en: "Philippine Embassy - Riyadh",
      },
    },
    worker: {
      worker_name_ar: "خوان ديلا كروز",
      worker_name_en: "Juan Dela Cruz",
      worker_phone: "09171234567",
      birth_date: "1995-05-20",
      philippines_address: "123 Mabini St, Manila, Philippines",
      passport_number: "P1234567A",
      passport_issue_date: "2020-01-15",
      passport_expiry_date: "2030-01-15",
    },
    documents: {
      national_id_image: `${STORAGE}/1/Container-%283%29.png`,
      iqama_image: `${STORAGE}/2/sea-asistant.png`,
      passport_image: `${STORAGE}/3/logo-%282%29.png`,
      exit_reentry_visa: `${STORAGE}/4/tsd.jpeg`,
      worker_signature: `${STORAGE}/5/digital-marketing-hero.png`,
      employer_signature: `${STORAGE}/6/events.png`,
      salary: "2500.00",
    },
    assigned_to: null,
    created_by: null,
    processed_by: null,
    held_by: null,
    sent_for_authentication_by: null,
    final_contract_uploaded_by: null,
    paid_by: null,
    cancelled_by: null,
    refund_requested_by: null,
    refund_decided_by: null,
    activities: [],
    ...rest,
    status_label: overrideLabel ?? statusLabel(overrides.status),
  };
}

/** Detail payloads covering the main workflow statuses. */
export const MOCK_ORDER_DETAILS: OrderDetail[] = [
  baseDetail({
    id: 1,
    status: "draft",
    current_step: 3,
    is_submitted: false,
    created_at: "2026-07-29 08:39:35",
    updated_at: "2026-07-29 09:43:29",
  }),
  baseDetail({
    id: 2,
    status: "new",
    request_number: "REQ-2026-0002",
    current_step: 7,
    is_submitted: true,
    submitted_at: "2026-07-28 11:20:00",
    expected_completion_date: "2026-08-15",
    source: "manual",
    source_label: "Manual",
    assigned_to: STAFF.sara,
    created_by: STAFF.fahad,
    employer: {
      employer_name_ar: "عبدالله القحطاني",
      employer_name_en: "Abdullah Al-Qahtani",
      national_id: "1023456789",
      phone: "0550666012",
      city_id: 1,
      city: { id: 1, name_ar: "الرياض", name_en: "Riyadh" },
      passport_issue_place_id: 1,
      passport_issue_place: {
        id: 1,
        name_ar: "السفارة الفلبينية - الرياض",
        name_en: "Philippine Embassy - Riyadh",
      },
    },
    worker: {
      worker_name_ar: "ماريا سانتوس",
      worker_name_en: "Maria Santos",
      worker_phone: "09181234567",
      birth_date: "1990-08-03",
      philippines_address: "Mandaue City, Cebu, Philippines",
      passport_number: "P2345678B",
      passport_issue_date: "2021-07-18",
      passport_expiry_date: "2031-07-17",
    },
    activities: [
      {
        id: 1,
        action: "submitted",
        action_label: "Order submitted",
        notes: null,
        created_at: "2026-07-28 11:20:00",
        performed_by: STAFF.fahad,
      },
    ],
    created_at: "2026-07-28 10:05:00",
    updated_at: "2026-07-28 11:20:00",
  }),
  baseDetail({
    id: 3,
    status: "under_review",
    request_number: "REQ-2026-0003",
    current_step: 7,
    is_submitted: true,
    submitted_at: "2026-07-27 09:00:00",
    review_started_at: "2026-07-27 10:15:00",
    expected_completion_date: "2026-08-10",
    assigned_to: STAFF.fahad,
    activities: [
      {
        id: 2,
        action: "submitted",
        action_label: "Order submitted",
        notes: null,
        created_at: "2026-07-27 09:00:00",
        performed_by: null,
      },
      {
        id: 3,
        action: "review_started",
        action_label: "Review started",
        notes: null,
        created_at: "2026-07-27 10:15:00",
        performed_by: STAFF.fahad,
      },
    ],
    created_at: "2026-07-27 08:40:00",
    updated_at: "2026-07-27 10:15:00",
  }),
  baseDetail({
    id: 5,
    status: "held",
    request_number: "REQ-2026-0005",
    current_step: 7,
    is_submitted: true,
    submitted_at: "2026-07-24 09:30:00",
    review_started_at: "2026-07-24 11:00:00",
    held_at: "2026-07-25 12:15:00",
    hold_reason: "missing_document",
    hold_reason_label: "Missing document",
    hold_notes: "Passport first page is unclear.",
    held_by: STAFF.khalid,
    assigned_to: STAFF.khalid,
    employer: {
      employer_name_ar: "مها الحربي",
      employer_name_en: "Maha Alharbi",
      national_id: "1098765432",
      phone: "0509777033",
      city_id: 2,
      city: { id: 2, name_ar: "جدة", name_en: "Jeddah" },
      passport_issue_place_id: 1,
      passport_issue_place: {
        id: 1,
        name_ar: "السفارة الفلبينية - الرياض",
        name_en: "Philippine Embassy - Riyadh",
      },
    },
    worker: {
      worker_name_ar: "خوسيه غارسيا",
      worker_name_en: "Jose Garcia",
      worker_phone: "09192223344",
      birth_date: "1989-11-09",
      philippines_address: "Bacolod City, Negros Occidental, Philippines",
      passport_number: "P5678901E",
      passport_issue_date: "2019-03-22",
      passport_expiry_date: "2029-03-21",
    },
    activities: [
      {
        id: 4,
        action: "held",
        action_label: "Order held",
        notes: "Passport first page is unclear.",
        created_at: "2026-07-25 12:15:00",
        performed_by: STAFF.khalid,
      },
    ],
    created_at: "2026-07-24 09:00:00",
    updated_at: "2026-07-25 12:15:00",
  }),
  baseDetail({
    id: 7,
    status: "awaiting_payment",
    request_number: "REQ-2026-0007",
    current_step: 7,
    is_submitted: true,
    submitted_at: "2026-07-15 08:00:00",
    review_started_at: "2026-07-15 09:00:00",
    processed_at: "2026-07-16 10:00:00",
    sent_for_authentication_at: "2026-07-17 11:00:00",
    final_contract_uploaded_at: "2026-07-23 15:00:00",
    has_final_contract: true,
    final_contract_url: `${STORAGE}/contracts/cnt-88501.pdf`,
    contract_number: "CNT-88501",
    contract_qr_code: "QR-88501",
    contract_generated_at: "2026-07-16 10:05:00",
    contract_url: `${STORAGE}/contracts/draft-88501.pdf`,
    delivery_required: true,
    delivery_status: "pending",
    delivery_status_label: "Pending",
    service_fee: "250.00",
    delivery_fee: "50.00",
    total_fee: "300.00",
    payment_notification_text:
      "Please pay SAR 300 to complete your contract request.",
    assigned_to: STAFF.noura,
    processed_by: STAFF.sara,
    sent_for_authentication_by: STAFF.fahad,
    final_contract_uploaded_by: STAFF.noura,
    created_at: "2026-07-15 07:45:00",
    updated_at: "2026-07-23 15:00:00",
  }),
  baseDetail({
    id: 8,
    status: "completed",
    request_number: "REQ-2026-0008",
    current_step: 7,
    is_submitted: true,
    submitted_at: "2026-07-08 09:00:00",
    review_started_at: "2026-07-08 10:00:00",
    processed_at: "2026-07-09 11:00:00",
    sent_for_authentication_at: "2026-07-10 10:00:00",
    final_contract_uploaded_at: "2026-07-12 16:00:00",
    has_final_contract: true,
    final_contract_url: `${STORAGE}/contracts/cnt-88610.pdf`,
    contract_number: "CNT-88610",
    contract_qr_code: "QR-88610",
    contract_generated_at: "2026-07-09 11:05:00",
    contract_url: `${STORAGE}/contracts/draft-88610.pdf`,
    delivery_required: true,
    delivery_status: "delivered",
    delivery_status_label: "Delivered",
    service_fee: "250.00",
    delivery_fee: "50.00",
    total_fee: "300.00",
    payment_type: "online",
    payment_type_label: "Online",
    paid_at: "2026-07-14 13:20:00",
    payment_proof_url: `${STORAGE}/payments/proof-88610.png`,
    assigned_to: STAFF.fahad,
    processed_by: STAFF.khalid,
    sent_for_authentication_by: STAFF.sara,
    final_contract_uploaded_by: STAFF.noura,
    paid_by: STAFF.fahad,
    activities: [
      {
        id: 5,
        action: "paid",
        action_label: "Payment confirmed",
        notes: null,
        created_at: "2026-07-14 13:20:00",
        performed_by: STAFF.fahad,
      },
      {
        id: 6,
        action: "completed",
        action_label: "Order completed",
        notes: null,
        created_at: "2026-07-14 13:21:00",
        performed_by: STAFF.fahad,
      },
    ],
    created_at: "2026-07-08 08:30:00",
    updated_at: "2026-07-14 13:21:00",
  }),
  baseDetail({
    id: 10,
    status: "cancelled",
    request_number: "REQ-2026-0010",
    current_step: 7,
    is_submitted: true,
    submitted_at: "2026-07-10 08:00:00",
    processed_at: "2026-07-11 09:00:00",
    sent_for_authentication_at: "2026-07-12 10:00:00",
    final_contract_uploaded_at: "2026-07-14 11:00:00",
    has_final_contract: true,
    final_contract_url: `${STORAGE}/contracts/cnt-88700.pdf`,
    contract_number: "CNT-88700",
    delivery_required: true,
    delivery_status: "required",
    delivery_status_label: "Required",
    service_fee: "250.00",
    delivery_fee: "50.00",
    total_fee: "300.00",
    payment_type: "manual",
    payment_type_label: "Manual",
    paid_at: "2026-07-18 12:00:00",
    cancellation_reason: "payment_timeout",
    cancellation_reason_label: "Payment timeout",
    cancellation_source: "system",
    cancellation_source_label: "System",
    cancelled_status_before: "awaiting_payment",
    cancelled_status_before_label: "Awaiting payment",
    cancelled_at: "2026-07-20 23:59:00",
    linked_to_refund: true,
    is_frozen: true,
    refund_status: "pending",
    refund_status_label: "Pending",
    refund_method: "bank_transfer",
    refund_method_label: "Bank transfer",
    refund_amount: "300.00",
    refund_reason: "Order cancelled after payment.",
    refund_requested_at: "2026-07-21 09:00:00",
    can_approve_refund: true,
    can_reject_refund: true,
    cancelled_by: null,
    refund_requested_by: STAFF.sara,
    created_at: "2026-07-10 07:50:00",
    updated_at: "2026-07-21 09:00:00",
  }),
  /** Captured from the staging detail endpoint (sent for authentication). */
  baseDetail({
    id: 14,
    request_number: "266207",
    current_step: 4,
    status: "sent_for_authentication",
    status_label: "Sent for authentication",
    source: "e_form",
    source_label: "E-form",
    is_submitted: true,
    submitted_at: "2026-07-30 07:07:36",
    expected_completion_date: "2026-08-06",
    review_started_at: "2026-07-30 09:26:39",
    processed_at: "2026-07-30 09:26:43",
    contract_number: "CNT-2026-M6DD819",
    contract_qr_code:
      '{"contract_number":"CNT-2026-M6DD819","request_number":"266207"}',
    contract_generated_at: "2026-07-30 09:26:43",
    contract_url: `${STORAGE}/71/CNT-2026-M6DD819.html`,
    sent_for_authentication_at: "2026-07-30 09:57:15",
    employer: {
      employer_name_ar: "كيرلس",
      employer_name_en: "kerolos",
      national_id: "1111111111",
      phone: "0512222222",
      city_id: 36,
      city: { id: 36, name_ar: "بقيق", name_en: "Abqaiq" },
      passport_issue_place_id: 2,
      passport_issue_place: {
        id: 2,
        name_ar: "القنصلية الفلبينية العامة - جدة",
        name_en: "Philippine Consulate General - Jeddah",
      },
    },
    worker: {
      worker_name_ar: "احمد",
      worker_name_en: "ahmed",
      worker_phone: "0522222222",
      birth_date: "2008-07-01",
      philippines_address: "address",
      passport_issue_place_id: 37,
      passport_issue_place: {
        id: 37,
        name_ar: "وزارة الخارجية الفلبينية - بوتوان",
        name_en: "DFA Butuan",
      },
      passport_number: "123456789",
      passport_issue_date: "2026-07-01",
      passport_expiry_date: "2026-07-31",
    },
    documents: {
      national_id_image: `${STORAGE}/64/hero.png`,
      iqama_image: `${STORAGE}/65/hero.png`,
      passport_image: `${STORAGE}/66/hero.png`,
      exit_reentry_visa: `${STORAGE}/67/hero.png`,
      worker_signature: `${STORAGE}/68/signature.png`,
      employer_signature: `${STORAGE}/69/signature.png`,
      salary: "3000.00",
    },
    assigned_to: SUPER_ADMIN,
    processed_by: SUPER_ADMIN,
    sent_for_authentication_by: SUPER_ADMIN,
    activities: [
      {
        id: 17,
        action: "sent_for_authentication",
        action_label: "Contract sent for authentication",
        description: "Contract sent for authentication",
        meta: { contract_number: "CNT-2026-M6DD819" },
        admin: SUPER_ADMIN,
        created_at: "2026-07-30 09:57:15",
      },
      {
        id: 14,
        action: "contract_generated",
        action_label: "Contract generated",
        description: "Contract generated",
        meta: { contract_number: "CNT-2026-M6DD819" },
        admin: SUPER_ADMIN,
        created_at: "2026-07-30 09:26:43",
      },
      {
        id: 13,
        action: "processed",
        action_label: "Request processed",
        description: "Request processed",
        meta: null,
        admin: SUPER_ADMIN,
        created_at: "2026-07-30 09:26:43",
      },
      {
        id: 12,
        action: "review_started",
        action_label: "Review started",
        description: "Review started",
        meta: null,
        admin: SUPER_ADMIN,
        created_at: "2026-07-30 09:26:39",
      },
    ],
    created_at: "2026-07-30 06:36:10",
    updated_at: "2026-07-30 09:57:15",
  }),
];

export function getMockOrderListByStatus(status: OrderStatus): OrderListItem[] {
  return MOCK_ORDER_LIST.filter((order) => order.status === status);
}

export function getMockOrderDetailById(id: number): OrderDetail | undefined {
  return MOCK_ORDER_DETAILS.find((order) => order.id === id);
}

export const ORDER_STATUS_LABELS = STATUS_LABELS;

const DOCUMENT_FIELD_MAP: {
  key: keyof OrderDetail["documents"];
  type: OrderDocumentType;
}[] = [
  { key: "national_id_image", type: "nationalId" },
  { key: "iqama_image", type: "workerId" },
  { key: "passport_image", type: "passportFirstPage" },
  { key: "exit_reentry_visa", type: "exitReentryVisa" },
  { key: "employer_signature", type: "employerSignature" },
  { key: "worker_signature", type: "workerSignature" },
];

function pickLocalizedName(
  nameEn: string | null | undefined,
  nameAr: string | null | undefined
) {
  return nameEn?.trim() || nameAr?.trim() || "—";
}

function pickRefName(ref: OrderNamedRef | null | undefined) {
  if (!ref) return "—";
  return pickLocalizedName(ref.name_en ?? ref.name, ref.name_ar);
}

function formatApiDateTime(value: string | null | undefined) {
  if (!value) {
    return { dateLabel: "—", timeLabel: "—", isoDate: "" };
  }

  const [datePart = "", timePart = ""] = value.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour = 0, minute = 0] = timePart.split(":").map(Number);

  if (!year || !month || !day) {
    return { dateLabel: value, timeLabel: timePart || "—", isoDate: datePart };
  }

  const date = new Date(year, month - 1, day, hour, minute);
  const dateLabel = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { dateLabel, timeLabel, isoDate: datePart };
}

function toUiSource(source: OrderDetail["source"]): OrderSource {
  return source === "e_form" ? "eform" : "manual";
}

function toLocalPhoneDigits(phone: string | null | undefined) {
  const digits = (phone ?? "").replace(/\D/g, "");
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

function toInitials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => part && part !== "—")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function mapHoldInfo(detail: OrderDetail): OrderHoldInfo | null {
  if (detail.status !== "held") return null;

  const held = formatApiDateTime(detail.held_at);
  const heldByName = pickRefName(detail.held_by);

  return {
    reason: (detail.hold_reason as HoldReasonValue | null) ?? null,
    reasonLabel: detail.hold_reason_label ?? "—",
    notes: detail.hold_notes,
    heldByName,
    heldByInitials: toInitials(heldByName),
    heldAtDateLabel: held.dateLabel,
    heldAtTimeLabel: held.timeLabel,
  };
}

/** Maps API order detail → UI review shape used by OrderView (temp). */
export function mapOrderDetailToReview(detail: OrderDetail): OrderReviewDetail {
  const created = formatApiDateTime(detail.created_at);
  const assignee = pickRefName(detail.assigned_to);

  const documents = DOCUMENT_FIELD_MAP.flatMap(({ key, type }) => {
    const url = detail.documents[key];
    if (!url || typeof url !== "string") return [];

    const isUnclearPassport =
      detail.status === "held" &&
      (detail.hold_reason === "missing_document" ||
        detail.hold_reason === "unclear_document") &&
      type === "passportFirstPage";

    return [
      {
        id: `${detail.id}-${type}`,
        type,
        uploadedAtIso: created.isoDate || "2026-07-01",
        sizeLabel: "1.2 MB",
        format: isUnclearPassport
          ? "JPG"
          : url.toLowerCase().endsWith(".pdf")
            ? "PDF"
            : "IMG",
        url,
        issue: isUnclearPassport ? ("unclear" as const) : null,
      },
    ];
  });

  return {
    id: String(detail.id),
    orderNumber: detail.request_number ?? `#ORD-${detail.id}`,
    employerName: pickLocalizedName(
      detail.employer.employer_name_en,
      detail.employer.employer_name_ar
    ),
    nationalId: detail.employer.national_id ?? "—",
    phoneLocal: toLocalPhoneDigits(detail.employer.phone),
    city: detail.employer.city
      ? pickLocalizedName(detail.employer.city.name_en, detail.employer.city.name_ar)
      : "—",
    address: detail.employer.city
      ? pickLocalizedName(detail.employer.city.name_en, detail.employer.city.name_ar)
      : "—",
    workerName: pickLocalizedName(
      detail.worker.worker_name_en,
      detail.worker.worker_name_ar
    ),
    workerPhoneLocal: toLocalPhoneDigits(detail.worker.worker_phone),
    workerBirthDate: detail.worker.birth_date ?? "",
    workerHomeAddress: detail.worker.philippines_address ?? "—",
    workerPassportIssuePlace: pickRefName(
      detail.worker.passport_issue_place ?? detail.employer.passport_issue_place
    ),
    workerPassportNumber: detail.worker.passport_number ?? "—",
    workerPassportIssueDate: detail.worker.passport_issue_date ?? "",
    workerPassportExpiryDate: detail.worker.passport_expiry_date ?? "",
    expectedExecutionLabel: detail.expected_completion_date ?? "—",
    source: toUiSource(detail.source),
    status: detail.status,
    statusLabel: detail.status_label,
    assignee,
    createdAtLabel: created.dateLabel,
    createdTimeLabel: created.timeLabel,
    relativeTimeLabel: "10m",
    hold: mapHoldInfo(detail),
    changeHistory: detail.activities.map((activity) => ({
      id: String(activity.id),
      employee: pickRefName(activity.admin ?? activity.performed_by),
      actionType: activity.action_label ?? activity.action,
      dateTime: activity.created_at,
    })),
    documents,
  };
}

export function getOrderReviewFromApiMock(
  orderId: string
): OrderReviewDetail | undefined {
  const id = Number(orderId);
  if (!Number.isFinite(id)) return undefined;
  const detail = getMockOrderDetailById(id);
  return detail ? mapOrderDetailToReview(detail) : undefined;
}
