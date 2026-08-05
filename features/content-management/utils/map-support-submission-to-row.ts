import type { SupportSubmissionRow } from "@/features/content-management/types";
import { readStringField } from "@/lib/api-payload";
import {
  formatApiDateTime,
  type AppLocale,
} from "@/lib/format-datetime";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNumberField(
  entry: Record<string, unknown>,
  keys: readonly string[],
  fallback: number | null = null,
): number | null {
  for (const key of keys) {
    const value = entry[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return fallback;
}

function readInquiryTypeNames(entry: Record<string, unknown>): {
  ar: string;
  en: string;
} {
  const inquiryType =
    entry.inquiryType ?? entry.inquiry_type ?? null;
  if (!isRecord(inquiryType)) return { ar: "", en: "" };

  const name = inquiryType.name;
  if (!isRecord(name)) return { ar: "", en: "" };

  return {
    ar: typeof name.ar === "string" ? name.ar : "",
    en: typeof name.en === "string" ? name.en : "",
  };
}

export function mapSupportSubmissionToRow(
  entry: unknown,
  locale: AppLocale,
): SupportSubmissionRow | null {
  if (!isRecord(entry)) return null;

  const id = readNumberField(entry, ["id"], null);
  if (id === null) return null;

  const firstName =
    readStringField(entry, ["firstName", "first_name"]) ?? "";
  const lastName =
    readStringField(entry, ["lastName", "last_name"]) ?? "";
  const inquiryTypeNames = readInquiryTypeNames(entry);
  const createdAt =
    readStringField(entry, ["createdAt", "created_at"]) ?? "";
  const updatedAt =
    readStringField(entry, ["updatedAt", "updated_at"]) ?? "";
  const created = formatApiDateTime(createdAt, locale);
  const updated = formatApiDateTime(updatedAt, locale);
  const status = readStringField(entry, ["status"]) ?? "new";

  return {
    id,
    firstName,
    lastName,
    fullName: [firstName, lastName].filter(Boolean).join(" ").trim(),
    phone: readStringField(entry, ["phone"]) ?? "",
    orderNumber:
      readStringField(entry, ["orderNumber", "order_number"]) ?? "",
    inquiryTypeId: readNumberField(
      entry,
      ["inquiryTypeId", "inquiry_type_id"],
      null,
    ),
    inquiryTypeNameAr: inquiryTypeNames.ar,
    inquiryTypeNameEn: inquiryTypeNames.en,
    message: readStringField(entry, ["message"]) ?? "",
    status,
    statusLabel:
      readStringField(entry, ["statusLabel", "status_label"]) ?? status,
    createdAt,
    updatedAt,
    createdDate: created.dateLabel,
    createdTime: created.timeLabel,
    updatedDate: updated.dateLabel,
    updatedTime: updated.timeLabel,
  };
}
