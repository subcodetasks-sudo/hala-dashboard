import { z } from "zod";

import type { ServiceItemFormValues } from "@/features/content-management/types";

type ServiceItemFormMessages = {
  titleArRequired: string;
  titleEnRequired: string;
  descriptionArRequired: string;
  descriptionEnRequired: string;
  buttonTextArRequired: string;
  buttonTextEnRequired: string;
  buttonLinkRequired: string;
  sortOrderRequired: string;
  sortOrderInvalid: string;
};

export function createServiceItemFormSchema(messages: ServiceItemFormMessages) {
  return z.object({
    titleAr: z.string().trim().min(1, messages.titleArRequired),
    titleEn: z.string().trim().min(1, messages.titleEnRequired),
    descriptionAr: z.string().trim().min(1, messages.descriptionArRequired),
    descriptionEn: z.string().trim().min(1, messages.descriptionEnRequired),
    buttonTextAr: z.string().trim().min(1, messages.buttonTextArRequired),
    buttonTextEn: z.string().trim().min(1, messages.buttonTextEnRequired),
    buttonLink: z.string().trim().min(1, messages.buttonLinkRequired),
    sortOrder: z
      .string()
      .trim()
      .min(1, messages.sortOrderRequired)
      .refine((value) => /^\d+$/.test(value) && Number(value) >= 0, {
        message: messages.sortOrderInvalid,
      }),
  });
}

export type ServiceItemFormSchema = z.infer<
  ReturnType<typeof createServiceItemFormSchema>
>;

export const EMPTY_SERVICE_ITEM_FORM_VALUES: ServiceItemFormValues = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  buttonTextAr: "",
  buttonTextEn: "",
  buttonLink: "",
  sortOrder: "1",
};

export const SERVICES_ITEMS_PER_PAGE = 15;
