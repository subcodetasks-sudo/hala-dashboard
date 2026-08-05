import type { InquiryTypeRow } from "@/features/content-management/types";
import { readStringField } from "@/lib/api-payload";
import {
  formatApiDateTime,
  type AppLocale,
} from "@/lib/format-datetime";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readLocalizedText(
  entry: Record<string, unknown>,
  keys: readonly string[],
): { ar: string; en: string } {
  for (const key of keys) {
    const value = entry[key];
    if (!isRecord(value)) continue;
    const ar = typeof value.ar === "string" ? value.ar : "";
    const en = typeof value.en === "string" ? value.en : "";
    return { ar, en };
  }
  return { ar: "", en: "" };
}

function readNumberField(
  entry: Record<string, unknown>,
  keys: readonly string[],
  fallback = 0,
): number {
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

export function mapInquiryTypeToRow(
  entry: unknown,
  locale: AppLocale,
): InquiryTypeRow | null {
  if (!isRecord(entry)) return null;

  const id = readNumberField(entry, ["id"], 0);
  if (!id) return null;

  const name = readLocalizedText(entry, ["name"]);
  const status = readStringField(entry, ["status"]) ?? "active";
  const statusLabel =
    readStringField(entry, ["statusLabel", "status_label"]) ?? status;
  const createdAt =
    readStringField(entry, ["createdAt", "created_at"]) ?? "";
  const updatedAt =
    readStringField(entry, ["updatedAt", "updated_at"]) ?? "";
  const created = formatApiDateTime(createdAt, locale);
  const updated = formatApiDateTime(updatedAt, locale);

  return {
    id,
    nameAr: name.ar,
    nameEn: name.en,
    sortOrder: readNumberField(entry, ["sortOrder", "sort_order"], 0),
    status,
    statusLabel,
    createdAt,
    updatedAt,
    createdDate: created.dateLabel,
    createdTime: created.timeLabel,
    updatedDate: updated.dateLabel,
    updatedTime: updated.timeLabel,
  };
}
