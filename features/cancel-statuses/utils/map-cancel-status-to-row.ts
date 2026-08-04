import type { CancelStatusRow } from "@/features/cancel-statuses/types";
import {
  formatApiDateTime,
  type AppLocale,
} from "@/lib/format-datetime";
import { readStringField } from "@/lib/api-payload";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readBooleanField(
  entry: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  for (const key of keys) {
    const value = entry[key];
    if (typeof value === "boolean") return value;
    if (value === 1 || value === "1" || value === "true") return true;
    if (value === 0 || value === "0" || value === "false") return false;
  }
  return false;
}

/** Normalizes a cancel-status API item into a table row. */
export function mapCancelStatusToRow(
  entry: unknown,
  locale: AppLocale,
): CancelStatusRow | null {
  if (!isRecord(entry)) {
    return null;
  }

  const rawId = entry.id;
  const id =
    typeof rawId === "number" && Number.isFinite(rawId)
      ? rawId
      : typeof rawId === "string" && rawId.trim()
        ? Number(rawId)
        : NaN;

  if (!Number.isFinite(id)) {
    return null;
  }

  const textAr =
    readStringField(entry, ["textAr", "text_ar", "nameAr", "name_ar"]) ?? "";
  const textEn =
    readStringField(entry, ["textEn", "text_en", "nameEn", "name_en"]) ?? "";
  const active = readBooleanField(entry, ["active", "is_active", "isActive"]);
  const createdAt =
    readStringField(entry, ["createdAt", "created_at"]) ?? "";
  const updatedAt =
    readStringField(entry, ["updatedAt", "updated_at"]) ?? "";

  const created = formatApiDateTime(createdAt, locale);
  const updated = formatApiDateTime(updatedAt, locale);

  return {
    id,
    textAr,
    textEn,
    active,
    createdAt,
    updatedAt,
    createdDate: created.dateLabel,
    createdTime: created.timeLabel,
    updatedDate: updated.dateLabel,
    updatedTime: updated.timeLabel,
  };
}
