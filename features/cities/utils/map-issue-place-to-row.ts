import type {
  IssuePlaceCountry,
  IssuePlaceRow,
  CityStatus,
} from "@/features/cities/types";
import {
  formatApiDateTime,
  type AppLocale,
} from "@/lib/format-datetime";
import { readStringField } from "@/lib/api-payload";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mapStatus(status: string | null | undefined): CityStatus {
  return status === "inactive" ? "inactive" : "active";
}

function mapCountry(
  country: string | null | undefined,
): IssuePlaceCountry {
  return country === "ph" ? "ph" : "sa";
}

/** Normalizes a passport issue place API item into a table row. */
export function mapIssuePlaceToRow(
  entry: unknown,
  locale: AppLocale,
): IssuePlaceRow | null {
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

  const nameAr =
    readStringField(entry, ["nameAr", "name_ar", "titleAr", "title_ar"]) ?? "";
  const nameEn =
    readStringField(entry, ["nameEn", "name_en", "titleEn", "title_en"]) ?? "";
  const country = mapCountry(readStringField(entry, ["country"]));
  const countryLabel =
    readStringField(entry, ["countryLabel", "country_label"]) ?? country;
  const status = mapStatus(readStringField(entry, ["status"]));
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
    nameAr,
    nameEn,
    country,
    countryLabel,
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
