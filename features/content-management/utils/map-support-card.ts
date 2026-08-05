import type {
  SupportCardApiItem,
  SupportCardButtonType,
  SupportCardNumber,
  SupportCardRow,
} from "@/features/content-management/types";
import { readStringField } from "@/lib/api-payload";

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

function normalizeButtonType(
  value: string | undefined,
  cardNumber: SupportCardNumber,
): SupportCardButtonType {
  if (value === "phone" || value === "email") return value;
  return cardNumber === 1 ? "phone" : "email";
}

export function mapSupportCardToRow(
  entry: unknown,
  fallbackCardNumber: SupportCardNumber,
): SupportCardRow | null {
  if (!isRecord(entry)) return null;

  const cardNumberRaw = readNumberField(
    entry,
    ["cardNumber", "card_number"],
    fallbackCardNumber,
  );
  const cardNumber: SupportCardNumber =
    cardNumberRaw === 2 ? 2 : 1;

  const title = readLocalizedText(entry, ["title"]);
  const description = readLocalizedText(entry, ["description"]);
  const buttonLabel = readLocalizedText(entry, [
    "buttonLabel",
    "button_label",
  ]);
  const buttonType = normalizeButtonType(
    readStringField(entry, ["buttonType", "button_type"]),
    cardNumber,
  );
  const idRaw = readNumberField(entry, ["id"], 0);

  return {
    id: idRaw > 0 ? idRaw : null,
    cardNumber,
    titleAr: title.ar,
    titleEn: title.en,
    descriptionAr: description.ar,
    descriptionEn: description.en,
    buttonType,
    buttonValue:
      readStringField(entry, ["buttonValue", "button_value"]) ?? "",
    buttonLabelAr: buttonLabel.ar,
    buttonLabelEn: buttonLabel.en,
    status: readStringField(entry, ["status"]) ?? "active",
    image: readStringField(entry, ["image"]) ?? null,
  };
}

export function ensureSupportCardPair(
  items: SupportCardRow[],
): [SupportCardRow, SupportCardRow] {
  const byNumber = new Map(items.map((item) => [item.cardNumber, item]));

  const phone: SupportCardRow = byNumber.get(1) ?? {
    id: null,
    cardNumber: 1,
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    buttonType: "phone",
    buttonValue: "",
    buttonLabelAr: "",
    buttonLabelEn: "",
    status: "active",
    image: null,
  };

  const email: SupportCardRow = byNumber.get(2) ?? {
    id: null,
    cardNumber: 2,
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    buttonType: "email",
    buttonValue: "",
    buttonLabelAr: "",
    buttonLabelEn: "",
    status: "active",
    image: null,
  };

  return [
    { ...phone, cardNumber: 1, buttonType: "phone" },
    { ...email, cardNumber: 2, buttonType: "email" },
  ];
}

export type { SupportCardApiItem };
