import { z } from "zod";

import type { InquiryTypeFormValues } from "@/features/content-management/types";

type InquiryTypeFormMessages = {
  nameArRequired: string;
  nameEnRequired: string;
  sortOrderRequired: string;
  sortOrderInvalid: string;
  statusRequired: string;
};

export function createInquiryTypeFormSchema(messages: InquiryTypeFormMessages) {
  return z.object({
    nameAr: z.string().trim().min(1, messages.nameArRequired),
    nameEn: z.string().trim().min(1, messages.nameEnRequired),
    sortOrder: z
      .string()
      .trim()
      .min(1, messages.sortOrderRequired)
      .refine((value) => /^\d+$/.test(value) && Number(value) >= 0, {
        message: messages.sortOrderInvalid,
      }),
    status: z.enum(["active", "inactive"], {
      message: messages.statusRequired,
    }),
  });
}

export type InquiryTypeFormSchema = z.infer<
  ReturnType<typeof createInquiryTypeFormSchema>
>;

export const EMPTY_INQUIRY_TYPE_FORM_VALUES: InquiryTypeFormValues = {
  nameAr: "",
  nameEn: "",
  sortOrder: "1",
  status: "active",
};

export const INQUIRY_TYPES_PER_PAGE = 15;
