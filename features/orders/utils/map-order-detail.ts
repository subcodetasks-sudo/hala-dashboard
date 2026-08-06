import type {
  DocumentCollection,
  OrderCancellationInfo,
  OrderDetail,
  OrderDocumentType,
  OrderHoldInfo,
  OrderNamedRef,
  OrderReviewDetail,
} from "@/features/orders/types";
import {
  formatApiDateTime,
  formatDateOnly,
  formatRelativeTimeLabel,
  formatRelativeTimeShort,
  type AppLocale,
} from "@/lib/format-datetime";
import {
  getOrderRefInitials,
  toUiOrderSource,
} from "@/features/orders/utils/map-order-list-item";

const DOCUMENT_FIELD_MAP: {
  key: DocumentCollection;
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
  locale: AppLocale,
  nameEn: string | null | undefined,
  nameAr: string | null | undefined,
) {
  if (locale === "ar") {
    return nameAr?.trim() || nameEn?.trim() || "—";
  }
  return nameEn?.trim() || nameAr?.trim() || "—";
}

function pickRefName(locale: AppLocale, ref: OrderNamedRef | null | undefined) {
  if (!ref) return "—";
  return pickLocalizedName(
    locale,
    ref.name_en ?? ref.name,
    ref.name_ar ?? ref.name,
  );
}

function parseSalary(value: string | null | undefined): number | null {
  if (value == null || !value.trim()) {
    return null;
  }

  const parsed = Number(value.replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
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

function mapHoldInfo(
  detail: OrderDetail,
  locale: AppLocale,
): OrderHoldInfo | null {
  if (detail.status !== "held") return null;

  const held = formatApiDateTime(detail.held_at, locale);
  const heldByName = pickRefName(locale, detail.held_by);

  return {
    reason: detail.hold_reason,
    reasonLabel: detail.hold_reason_label ?? "—",
    notes: detail.hold_notes,
    heldByName,
    heldByInitials: getOrderRefInitials(heldByName),
    heldAtDateLabel: held.dateLabel,
    heldAtTimeLabel: held.timeLabel,
    relativeTimeLabel: formatRelativeTimeLabel(detail.held_at, locale),
  };
}

function mapCancellationInfo(
  detail: OrderDetail,
  locale: AppLocale,
): OrderCancellationInfo | null {
  if (detail.status !== "cancelled") return null;

  const cancelled = formatApiDateTime(detail.cancelled_at, locale);

  return {
    reasonLabel:
      detail.cancellation_reason_label?.trim() ||
      detail.cancellation_reason?.trim() ||
      "—",
    notes: detail.cancellation_notes,
    cancelledAtDateLabel: cancelled.dateLabel,
    cancelledAtTimeLabel: cancelled.timeLabel,
  };
}

/** Maps `/admin/renewal-requests/:id` payload → UI review shape used by OrderView. */
export function mapOrderDetailToReview(
  detail: OrderDetail,
  locale: AppLocale = "en",
): OrderReviewDetail {
  const created = formatApiDateTime(detail.created_at, locale);
  const assignee = pickRefName(locale, detail.assigned_to);
  const cityName = detail.employer.city
    ? pickLocalizedName(
        locale,
        detail.employer.city.name_en,
        detail.employer.city.name_ar,
      )
    : "—";

  const documents = DOCUMENT_FIELD_MAP.flatMap(({ key, type }) => {
    const url = detail.documents[key];
    if (!url || typeof url !== "string") return [];

    const isUnclearPassport =
      detail.status === "held" &&
      detail.hold_reason === "unclear_document" &&
      type === "passportFirstPage";

    return [
      {
        id: `${detail.id}-${type}`,
        type,
        collection: key,
        uploadedAtIso: created.isoDate || detail.created_at.slice(0, 10),
        sizeLabel: "—",
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

  const employerPassportIssuePlace = detail.employer.passport_issue_place
    ? pickLocalizedName(
        locale,
        detail.employer.passport_issue_place.name_en,
        detail.employer.passport_issue_place.name_ar,
      )
    : "—";

  const workerPassportIssuePlace = detail.worker.passport_issue_place
    ? detail.worker.passport_issue_place.name_en?.trim() ||
      detail.worker.passport_issue_place.name_ar?.trim() ||
      "—"
    : "—";

  return {
    id: String(detail.id),
    orderNumber: detail.request_number ?? `#ORD-${detail.id}`,
    employerName: pickLocalizedName(
      locale,
      detail.employer.employer_name_en,
      detail.employer.employer_name_ar,
    ),
    employerNameAr: detail.employer.employer_name_ar?.trim() || "—",
    employerNameEn: detail.employer.employer_name_en?.trim() || "—",
    nationalId: detail.employer.national_id ?? "—",
    phoneLocal: toLocalPhoneDigits(detail.employer.phone),
    city: cityName,
    cityId: detail.employer.city_id ?? detail.employer.city?.id ?? null,
    passportIssuePlace: employerPassportIssuePlace,
    passportIssuePlaceId:
      detail.employer.passport_issue_place_id ??
      detail.employer.passport_issue_place?.id ??
      null,
    workerName: pickLocalizedName(
      locale,
      detail.worker.worker_name_en,
      detail.worker.worker_name_ar,
    ),
    workerNameAr: detail.worker.worker_name_ar?.trim() || "—",
    workerNameEn: detail.worker.worker_name_en?.trim() || "—",
    workerPhoneLocal: toLocalPhoneDigits(detail.worker.worker_phone),
    workerBirthDate: detail.worker.birth_date ?? "",
    workerHomeAddress: detail.worker.philippines_address ?? "—",
    workerPassportIssuePlace,
    workerPassportIssuePlaceId:
      detail.worker.passport_issue_place_id ??
      detail.worker.passport_issue_place?.id ??
      null,
    salary: parseSalary(detail.documents.salary),
    workerPassportNumber: detail.worker.passport_number ?? "—",
    workerPassportIssueDate: detail.worker.passport_issue_date ?? "",
    workerPassportExpiryDate: detail.worker.passport_expiry_date ?? "",
    expectedExecutionLabel: formatDateOnly(
      detail.expected_completion_date,
      locale,
    ),
    source: toUiOrderSource(detail.source),
    status: detail.status,
    statusLabel: detail.status_label,
    assignee,
    assignedToId: detail.assigned_to?.id ?? null,
    createdAtLabel: created.dateLabel,
    createdTimeLabel: created.timeLabel,
    relativeTimeLabel: formatRelativeTimeShort(detail.created_at, locale),
    hold: mapHoldInfo(detail, locale),
    cancellation: mapCancellationInfo(detail, locale),
    linkedToRefund: detail.linked_to_refund,
    planId: detail.plan_id,
    plan: detail.plan,
    changeHistory: detail.activities.map((activity) => ({
      id: String(activity.id),
      employee: pickRefName(locale, activity.admin ?? activity.performed_by),
      actionType: activity.description ?? activity.action_label ?? activity.action,
      dateTime: activity.created_at,
    })),
    documents,
  };
}
