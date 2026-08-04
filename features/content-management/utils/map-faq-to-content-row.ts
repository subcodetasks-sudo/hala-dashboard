import type {
  ContentRow,
  ContentStatus,
  FaqApiItem,
  LocalizedText,
} from "@/features/content-management/types";
import {
  formatApiDateTime,
  type AppLocale,
} from "@/lib/format-datetime";

function pickLocalizedText(
  value: LocalizedText | undefined,
  locale: AppLocale
): string {
  if (!value) return "—";
  if (locale === "ar") {
    return value.ar?.trim() || value.en?.trim() || "—";
  }
  return value.en?.trim() || value.ar?.trim() || "—";
}

function mapFaqStatus(status: string): ContentStatus {
  return status === "active" ? "published" : "draft";
}

/** Maps a FAQ API item into the shared content table row shape. */
export function mapFaqToContentRow(
  item: FaqApiItem,
  locale: AppLocale
): ContentRow {
  const updated = formatApiDateTime(item.updatedAt, locale);

  return {
    id: String(item.id),
    category: "faqs",
    title: pickLocalizedText(item.question, locale),
    answer: pickLocalizedText(item.answer, locale),
    typeLabel: "FAQ",
    updatedDate: updated.dateLabel,
    updatedTime: updated.timeLabel,
    updatedAtIso: updated.isoDate,
    appearance: undefined,
    author: "superAdmin",
    status: mapFaqStatus(item.status),
    displayOrder: String(item.sortOrder).padStart(2, "0"),
  };
}
