import type { OrderSource } from "@/features/home/types";
import type {
  NewOrderRow,
  OrderApiSource,
  OrderListItem,
  OrderNamedRef,
} from "@/features/orders/types";
import {
  formatApiDateTime,
  formatDateOnly,
  type AppLocale,
} from "@/features/orders/utils/format-datetime";

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

function formatPhoneDisplay(phone: string | null | undefined) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return "—";

  let local = digits;
  if (digits.startsWith("966") && digits.length >= 12) {
    local = digits.slice(3, 12);
  } else if (digits.startsWith("0") && digits.length >= 10) {
    local = digits.slice(1, 10);
  } else if (digits.length >= 9) {
    local = digits.slice(-9);
  }

  if (local.length === 9) {
    return `+966 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }

  return phone?.trim() || "—";
}

export function toUiOrderSource(source: OrderApiSource): OrderSource {
  return source === "e_form" ? "eform" : "manual";
}

export function toApiOrderSource(
  source: OrderSource | "all",
): OrderApiSource | undefined {
  if (source === "all") return undefined;
  return source === "eform" ? "e_form" : "manual";
}

export function getOrderEmployerName(
  item: OrderListItem,
  locale: AppLocale,
) {
  return pickLocalizedName(
    locale,
    item.employer_name_en,
    item.employer_name_ar,
  );
}

export function getOrderWorkerName(item: OrderListItem, locale: AppLocale) {
  return pickLocalizedName(locale, item.worker_name_en, item.worker_name_ar);
}

export function getOrderAssigneeName(
  item: OrderListItem,
  locale: AppLocale,
) {
  return pickRefName(locale, item.assigned_to);
}

export function getOrderHeldByName(item: OrderListItem, locale: AppLocale) {
  return pickRefName(locale, item.held_by);
}

export function getOrderProcessedByName(
  item: OrderListItem,
  locale: AppLocale,
) {
  return pickRefName(locale, item.processed_by);
}

export function getOrderCancelledByName(
  item: OrderListItem,
  locale: AppLocale,
) {
  return pickRefName(locale, item.cancelled_by);
}

export function getOrderCancelledAtDisplay(
  item: OrderListItem,
  locale: AppLocale = "en",
) {
  return formatApiDateTime(item.cancelled_at, locale);
}

export function getOrderRefInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part && part !== "—");
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

export function getOrderCreatedDisplay(
  item: OrderListItem,
  locale: AppLocale = "en",
) {
  return formatApiDateTime(item.created_at, locale);
}

export function getOrderHeldAtDisplay(
  item: OrderListItem,
  locale: AppLocale = "en",
) {
  return formatApiDateTime(item.held_at, locale);
}

export function getOrderProcessedAtDisplay(
  item: OrderListItem,
  locale: AppLocale = "en",
) {
  return formatApiDateTime(item.processed_at, locale);
}

export function getOrderExecutionDisplay(
  item: OrderListItem,
  locale: AppLocale = "en",
) {
  return formatDateOnly(item.expected_completion_date, locale);
}

export function getOrderPhoneDisplay(item: OrderListItem) {
  return formatPhoneDisplay(item.phone);
}

/** Maps a list API row into the existing new-orders table shape. */
export function mapOrderListItemToNewOrderRow(
  item: OrderListItem,
  locale: AppLocale,
): NewOrderRow {
  const created = formatApiDateTime(item.created_at, locale);
  const executionIso = item.expected_completion_date ?? "";

  return {
    id: String(item.id),
    orderNumber: item.request_number ?? `#ORD-${item.id}`,
    customerName: getOrderEmployerName(item, locale),
    customerPhone: formatPhoneDisplay(item.phone),
    handlerName: getOrderWorkerName(item, locale),
    createdDate: created.dateLabel,
    createdTime: created.timeLabel,
    source: toUiOrderSource(item.source),
    executionDate: formatDateOnly(item.expected_completion_date, locale),
    status: "new",
    createdAtIso: created.isoDate,
    executionDateIso: executionIso,
  };
}
