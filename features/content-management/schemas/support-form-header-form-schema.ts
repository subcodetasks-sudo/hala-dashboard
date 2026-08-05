import { z } from "zod";

import type { SupportFormHeaderFormValues } from "@/features/content-management/types";

type SupportFormHeaderFormMessages = {
  titleArRequired: string;
  titleEnRequired: string;
  descriptionArRequired: string;
  descriptionEnRequired: string;
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

export function createSupportFormHeaderFormSchema(
  messages: SupportFormHeaderFormMessages,
) {
  return z.object({
    titleAr: requiredRichText(messages.titleArRequired),
    titleEn: requiredRichText(messages.titleEnRequired),
    descriptionAr: z.string().trim().min(1, messages.descriptionArRequired),
    descriptionEn: z.string().trim().min(1, messages.descriptionEnRequired),
  });
}

export type SupportFormHeaderFormSchema = z.infer<
  ReturnType<typeof createSupportFormHeaderFormSchema>
>;

export const EMPTY_SUPPORT_FORM_HEADER_FORM_VALUES: SupportFormHeaderFormValues =
  {
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
  };
