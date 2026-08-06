import { z } from "zod";

import type { SettingsFormValues } from "@/features/settings/types";

type SettingsFormMessages = {
  descriptionArRequired: string;
  descriptionEnRequired: string;
  phoneRequired: string;
  emailRequired: string;
  emailInvalid: string;
  taxAmountInvalid: string;
};

export function createSettingsFormSchema(messages: SettingsFormMessages) {
  return z.object({
    descriptionAr: z.string().trim().min(1, messages.descriptionArRequired),
    descriptionEn: z.string().trim().min(1, messages.descriptionEnRequired),
    phone: z.string().trim().min(1, messages.phoneRequired),
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    facebook: z.string().trim(),
    twitter: z.string().trim(),
    instagram: z.string().trim(),
    linkedin: z.string().trim(),
    youtube: z.string().trim(),
    tiktok: z.string().trim(),
    snapchat: z.string().trim(),
    whatsapp: z.string().trim(),
    commercialRegister: z.string().trim(),
    taxNumber: z.string().trim(),
    taxAmount: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || (!Number.isNaN(Number(value)) && Number(value) >= 0),
        { message: messages.taxAmountInvalid },
      ),
  });
}

export type SettingsFormSchema = z.infer<
  ReturnType<typeof createSettingsFormSchema>
>;

export const EMPTY_SETTINGS_FORM_VALUES: SettingsFormValues = {
  descriptionAr: "",
  descriptionEn: "",
  phone: "",
  email: "",
  facebook: "",
  twitter: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  tiktok: "",
  snapchat: "",
  whatsapp: "",
  commercialRegister: "",
  taxNumber: "",
  taxAmount: "",
};
