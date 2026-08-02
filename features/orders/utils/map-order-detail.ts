import type {
  DocumentCollection,
  OrderDetail,
  OrderDocumentType,
  OrderHoldInfo,
  OrderNamedRef,
  OrderReviewDetail,
} from "@/features/orders/types";
import {
  getOrderRefInitials,
  toUiOrderSource,
} from "@/features/orders/utils/map-order-list-item";

type AppLocale = "ar" | "en";

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

function formatApiDateTime(value: string | null | undefined) {
  if (!value) {
    return { dateLabel: "—", timeLabel: "—", isoDate: "" };
  }

  const [datePart = "", timePart = ""] = value.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const timeSubparts = timePart.split(":");
  const hour = Number(timeSubparts[0] ?? 0);
  const minute = Number(timeSubparts[1] ?? 0);
  const second = Number(timeSubparts[2] ?? 0);

  if (!year || !month || !day) {
    return { dateLabel: value, timeLabel: timePart || "—", isoDate: datePart };
  }

  const date = new Date(year, month - 1, day, hour, minute, second);
  const dateLabel = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { dateLabel, timeLabel, isoDate: datePart };
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

  const held = formatApiDateTime(detail.held_at);
  const heldByName = pickRefName(locale, detail.held_by);

  return {
    reason: detail.hold_reason,
    reasonLabel: detail.hold_reason_label ?? "—",
    notes: detail.hold_notes,
    heldByName,
    heldByInitials: getOrderRefInitials(heldByName),
    heldAtDateLabel: held.dateLabel,
    heldAtTimeLabel: held.timeLabel,
  };
}

/** Maps `/admin/renewal-requests/:id` payload → UI review shape used by OrderView. */
export function mapOrderDetailToReview(
  detail: OrderDetail,
  locale: AppLocale = "en",
): OrderReviewDetail {
  const created = formatApiDateTime(detail.created_at);
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
      (detail.hold_reason === "missing_document" ||
        detail.hold_reason === "unclear_document") &&
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

  const passportIssuePlace = pickRefName(
    locale,
    detail.worker.passport_issue_place ?? detail.employer.passport_issue_place,
  );

  return {
    id: String(detail.id),
    orderNumber: detail.request_number ?? `#ORD-${detail.id}`,
    employerName: pickLocalizedName(
      locale,
      detail.employer.employer_name_en,
      detail.employer.employer_name_ar,
    ),
    nationalId: detail.employer.national_id ?? "—",
    phoneLocal: toLocalPhoneDigits(detail.employer.phone),
    city: cityName,
    address: cityName,
    workerName: pickLocalizedName(
      locale,
      detail.worker.worker_name_en,
      detail.worker.worker_name_ar,
    ),
    workerPhoneLocal: toLocalPhoneDigits(detail.worker.worker_phone),
    workerBirthDate: detail.worker.birth_date ?? "",
    workerHomeAddress: detail.worker.philippines_address ?? "—",
    workerPassportIssuePlace: passportIssuePlace,
    workerPassportNumber: detail.worker.passport_number ?? "—",
    workerPassportIssueDate: detail.worker.passport_issue_date ?? "",
    workerPassportExpiryDate: detail.worker.passport_expiry_date ?? "",
    expectedExecutionLabel: detail.expected_completion_date ?? "—",
    source: toUiOrderSource(detail.source),
    status: detail.status,
    statusLabel: detail.status_label,
    assignee,
    createdAtLabel: created.dateLabel,
    createdTimeLabel: created.timeLabel,
    relativeTimeLabel: "",
    hold: mapHoldInfo(detail, locale),
    changeHistory: detail.activities.map((activity) => ({
      id: String(activity.id),
      employee: pickRefName(locale, activity.admin ?? activity.performed_by),
      actionType: activity.description ?? activity.action_label ?? activity.action,
      dateTime: activity.created_at,
    })),
    documents,
  };
}
