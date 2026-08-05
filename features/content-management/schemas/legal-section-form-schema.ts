import { z } from "zod";

import type { LegalSectionFormValues } from "@/features/content-management/types";

type LegalSectionFormMessages = {
  titleArRequired: string;
  titleEnRequired: string;
  contentArRequired: string;
  contentEnRequired: string;
  descriptionArRequired: string;
  descriptionEnRequired: string;
  sortOrderRequired: string;
  sortOrderInvalid: string;
};

function hasRichTextContent(html: string): boolean {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0;
}

function requiredRichText(message: string) {
  return z.string().refine(hasRichTextContent, { message });
}

export function createLegalSectionFormSchema(
  messages: LegalSectionFormMessages,
) {
  return z.object({
    titleAr: z.string().trim().min(1, messages.titleArRequired),
    titleEn: z.string().trim().min(1, messages.titleEnRequired),
    contentAr: requiredRichText(messages.contentArRequired),
    contentEn: requiredRichText(messages.contentEnRequired),
    descriptionAr: z.string().trim().min(1, messages.descriptionArRequired),
    descriptionEn: z.string().trim().min(1, messages.descriptionEnRequired),
    sortOrder: z
      .string()
      .trim()
      .min(1, messages.sortOrderRequired)
      .refine((value) => /^\d+$/.test(value) && Number(value) >= 0, {
        message: messages.sortOrderInvalid,
      }),
  });
}

export type LegalSectionFormSchema = z.infer<
  ReturnType<typeof createLegalSectionFormSchema>
>;

export const EMPTY_LEGAL_SECTION_FORM_VALUES: LegalSectionFormValues = {
  titleAr: "",
  titleEn: "",
  contentAr: "",
  contentEn: "",
  descriptionAr: "",
  descriptionEn: "",
  sortOrder: "1",
};

export const LEGAL_SECTIONS_PER_PAGE = 15;
