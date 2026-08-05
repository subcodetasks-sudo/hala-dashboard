import type { PlanType } from "@/features/pricing/types";
import { PLAN_TYPES } from "@/features/pricing/schemas/package-form-schema";

function readFormText(formData: FormData, ...keys: string[]): string {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function parseAdvantages(
  raw: FormDataEntryValue | null,
): { text_ar: string; text_en: string }[] | null {
  if (typeof raw !== "string" || !raw.trim()) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    const items: { text_ar: string; text_en: string }[] = [];

    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as Record<string, unknown>;
      const textAr =
        typeof record.text_ar === "string"
          ? record.text_ar.trim()
          : typeof record.textAr === "string"
            ? record.textAr.trim()
            : "";
      const textEn =
        typeof record.text_en === "string"
          ? record.text_en.trim()
          : typeof record.textEn === "string"
            ? record.textEn.trim()
            : "";

      if (!textAr || !textEn) return null;
      items.push({ text_ar: textAr, text_en: textEn });
    }

    return items;
  } catch {
    return null;
  }
}

function isPlanType(value: string): value is PlanType {
  return (PLAN_TYPES as readonly string[]).includes(value);
}

export type PlanOutboundError =
  | "required"
  | "sortOrder"
  | "price"
  | "type"
  | "advantages";

export function buildPlanOutbound(
  formData: FormData,
): FormData | { error: PlanOutboundError } {
  const titleAr = readFormText(formData, "title_ar", "title[ar]");
  const titleEn = readFormText(formData, "title_en", "title[en]");
  const descriptionAr = readFormText(
    formData,
    "description_ar",
    "description[ar]",
  );
  const descriptionEn = readFormText(
    formData,
    "description_en",
    "description[en]",
  );
  const price = readFormText(formData, "price");
  const type = readFormText(formData, "type");
  const sortOrder = readFormText(formData, "sort_order", "sortOrder");
  const advantages = parseAdvantages(formData.get("advantages"));
  const icon = formData.get("icon") ?? formData.get("image");

  if (
    !titleAr ||
    !titleEn ||
    !descriptionAr ||
    !descriptionEn ||
    !price ||
    !type ||
    !sortOrder
  ) {
    return { error: "required" };
  }

  if (!isPlanType(type)) {
    return { error: "type" };
  }

  const parsedPrice = Number(price);
  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return { error: "price" };
  }

  if (!/^\d+$/.test(sortOrder)) {
    return { error: "sortOrder" };
  }

  if (!advantages) {
    return { error: "advantages" };
  }

  const outbound = new FormData();
  outbound.append("title_ar", titleAr);
  outbound.append("title_en", titleEn);
  outbound.append("description_ar", descriptionAr);
  outbound.append("description_en", descriptionEn);
  outbound.append("price", String(parsedPrice));
  outbound.append("type", type);
  outbound.append("active", "1");
  outbound.append("sort_order", sortOrder);
  outbound.append("advantages", JSON.stringify(advantages));

  if (icon instanceof File && icon.size > 0) {
    outbound.append("icon", icon, icon.name);
  }

  return outbound;
}

export function mapPlanOutboundError(
  error: PlanOutboundError,
  messages: {
    packageRequired: string;
    packageSortOrderInvalid: string;
    packagePriceInvalid: string;
    packageTypeInvalid: string;
    packageAdvantagesInvalid: string;
  },
): string {
  if (error === "sortOrder") return messages.packageSortOrderInvalid;
  if (error === "price") return messages.packagePriceInvalid;
  if (error === "type") return messages.packageTypeInvalid;
  if (error === "advantages") return messages.packageAdvantagesInvalid;
  return messages.packageRequired;
}
