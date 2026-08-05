import type { BlogRow } from "@/features/content-management/types";
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
  nestedKeys: readonly string[],
  flatArKeys: readonly string[],
  flatEnKeys: readonly string[],
): { ar: string; en: string } {
  for (const key of nestedKeys) {
    const value = entry[key];
    if (!isRecord(value)) continue;
    const ar = typeof value.ar === "string" ? value.ar : "";
    const en = typeof value.en === "string" ? value.en : "";
    if (ar || en) return { ar, en };
  }

  return {
    ar: readStringField(entry, [...flatArKeys]) ?? "",
    en: readStringField(entry, [...flatEnKeys]) ?? "",
  };
}

/** Normalizes a blog API item into a table row. */
export function mapBlogToRow(
  entry: unknown,
  locale: AppLocale,
): BlogRow | null {
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

  const title = readLocalizedText(
    entry,
    ["title"],
    ["title_ar", "titleAr"],
    ["title_en", "titleEn"],
  );
  const content = readLocalizedText(
    entry,
    ["content"],
    ["content_ar", "contentAr"],
    ["content_en", "contentEn"],
  );
  const slug = readStringField(entry, ["slug"]) ?? "";
  const status = readStringField(entry, ["status"]) ?? "active";
  const statusLabel =
    readStringField(entry, ["statusLabel", "status_label"]) ?? status;
  const image = readStringField(entry, ["image"]) ?? null;
  const publishedAt =
    readStringField(entry, ["publishedAt", "published_at"]) ?? "";
  const createdAt =
    readStringField(entry, ["createdAt", "created_at"]) ?? "";
  const updatedAt =
    readStringField(entry, ["updatedAt", "updated_at"]) ?? "";

  const created = formatApiDateTime(createdAt, locale);
  const updated = formatApiDateTime(updatedAt, locale);
  const published = formatApiDateTime(publishedAt, locale);

  return {
    id,
    titleAr: title.ar,
    titleEn: title.en,
    contentAr: content.ar,
    contentEn: content.en,
    slug,
    status,
    statusLabel,
    publishedAt,
    image,
    createdAt,
    updatedAt,
    createdDate: created.dateLabel,
    createdTime: created.timeLabel,
    updatedDate: updated.dateLabel,
    updatedTime: updated.timeLabel,
    publishedDate: published.dateLabel,
    publishedTime: published.timeLabel,
  };
}
