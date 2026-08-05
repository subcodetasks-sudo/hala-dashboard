import type {
  PackageFormValues,
  PlanAdvantageInput,
  PackageRow,
} from "@/features/pricing/types";
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

function readActive(entry: Record<string, unknown>): boolean {
  const value = entry.active ?? entry.status;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return (
      normalized === "1" ||
      normalized === "true" ||
      normalized === "active"
    );
  }
  return true;
}

function mapAdvantage(entry: unknown): PlanAdvantageInput | null {
  if (!isRecord(entry)) return null;

  if (isRecord(entry.text)) {
    const ar = typeof entry.text.ar === "string" ? entry.text.ar : "";
    const en = typeof entry.text.en === "string" ? entry.text.en : "";
    if (!ar && !en) return null;
    return { textAr: ar, textEn: en };
  }

  const textAr =
    readStringField(entry, ["text_ar", "textAr", "title_ar", "titleAr"]) ?? "";
  const textEn =
    readStringField(entry, ["text_en", "textEn", "title_en", "titleEn"]) ?? "";

  if (!textAr && !textEn) return null;
  return { textAr, textEn };
}

function readAdvantages(entry: Record<string, unknown>): PlanAdvantageInput[] {
  const raw = entry.advantages ?? entry.features;
  let list: unknown[] = [];

  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      return [];
    }
  } else if (Array.isArray(raw)) {
    list = raw;
  }

  return list
    .map(mapAdvantage)
    .filter((item): item is PlanAdvantageInput => item !== null);
}

/** Builds multipart body for `/admin/plans` create/update. */
export function buildPlanFormData(
  values: PackageFormValues,
  icon?: File,
): FormData {
  const formData = new FormData();
  formData.append("title_ar", values.titleAr.trim());
  formData.append("title_en", values.titleEn.trim());
  formData.append("description_ar", values.descriptionAr.trim());
  formData.append("description_en", values.descriptionEn.trim());
  formData.append("price", values.price.trim());
  formData.append("type", values.type);
  formData.append("active", "1");
  formData.append("sort_order", values.sortOrder.trim());
  formData.append(
    "advantages",
    JSON.stringify(
      values.advantages.map((item) => ({
        text_ar: item.textAr.trim(),
        text_en: item.textEn.trim(),
      })),
    ),
  );

  if (icon && icon.size > 0) {
    formData.append("icon", icon, icon.name);
  }

  return formData;
}

/** Normalizes a plan API item into a packages table row. */
export function mapPackageToRow(
  entry: unknown,
  locale: AppLocale,
): PackageRow | null {
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
    ["title", "name"],
    ["title_ar", "titleAr", "name_ar", "nameAr"],
    ["title_en", "titleEn", "name_en", "nameEn"],
  );
  const description = readLocalizedText(
    entry,
    ["description"],
    ["description_ar", "descriptionAr"],
    ["description_en", "descriptionEn"],
  );
  const icon =
    readStringField(entry, ["icon", "image"]) ?? null;
  const price = readNumberField(entry, ["price"], 0);
  const sortOrder = readNumberField(entry, ["sortOrder", "sort_order"], 0);
  const type = readStringField(entry, ["type"]) ?? "plan_renewal";
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
    price,
    type,
    active: readActive(entry),
    icon,
    sortOrder,
    advantages: readAdvantages(entry),
    createdAt,
    updatedAt,
    createdDate: created.dateLabel,
    createdTime: created.timeLabel,
    updatedDate: updated.dateLabel,
    updatedTime: updated.timeLabel,
  };
}
