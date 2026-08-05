import type { ServiceItemRow } from "@/features/content-management/types";
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

/** Normalizes a services API item into a table row. */
export function mapServiceToRow(
  entry: unknown,
  locale: AppLocale,
): ServiceItemRow | null {
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

  const title = readLocalizedText(entry, ["title"]);
  const description = readLocalizedText(entry, ["description"]);
  const buttonText = readLocalizedText(entry, [
    "buttonText",
    "button_text",
  ]);
  const buttonLink =
    readStringField(entry, ["buttonLink", "button_link", "link"]) ?? "";
  const image = readStringField(entry, ["image"]) ?? null;
  const sortOrder = readNumberField(entry, ["sortOrder", "sort_order"], 0);
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
    titleAr: title.ar,
    titleEn: title.en,
    descriptionAr: description.ar,
    descriptionEn: description.en,
    buttonTextAr: buttonText.ar,
    buttonTextEn: buttonText.en,
    buttonLink,
    image,
    sortOrder,
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
