import { z } from "zod";

import type { PackageFormValues } from "@/features/pricing/types";

type PackageFormMessages = {
  titleArRequired: string;
  titleEnRequired: string;
  descriptionArRequired: string;
  descriptionEnRequired: string;
  priceRequired: string;
  priceInvalid: string;
  typeRequired: string;
  sortOrderRequired: string;
  sortOrderInvalid: string;
  advantagesRequired: string;
  advantageTextArRequired: string;
  advantageTextEnRequired: string;
};

export const PLAN_TYPES = ["plan_renewal", "whatsapp"] as const;

export function createPackageFormSchema(messages: PackageFormMessages) {
  return z.object({
    titleAr: z.string().trim().min(1, messages.titleArRequired),
    titleEn: z.string().trim().min(1, messages.titleEnRequired),
    descriptionAr: z.string().trim().min(1, messages.descriptionArRequired),
    descriptionEn: z.string().trim().min(1, messages.descriptionEnRequired),
    price: z
      .string()
      .trim()
      .min(1, messages.priceRequired)
      .refine((value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed >= 0;
      }, { message: messages.priceInvalid }),
    type: z.enum(PLAN_TYPES, { message: messages.typeRequired }),
    sortOrder: z
      .string()
      .trim()
      .min(1, messages.sortOrderRequired)
      .refine((value) => /^\d+$/.test(value) && Number(value) >= 0, {
        message: messages.sortOrderInvalid,
      }),
    advantages: z
      .array(
        z.object({
          textAr: z.string().trim().min(1, messages.advantageTextArRequired),
          textEn: z.string().trim().min(1, messages.advantageTextEnRequired),
        }),
      )
      .min(1, messages.advantagesRequired),
  });
}

export type PackageFormSchema = z.infer<
  ReturnType<typeof createPackageFormSchema>
>;

export const EMPTY_PACKAGE_FORM_VALUES: PackageFormValues = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  price: "",
  type: "plan_renewal",
  sortOrder: "1",
  advantages: [{ textAr: "", textEn: "" }],
};

export const PACKAGES_PER_PAGE = 15;
