import { z } from "zod";

import type { StatisticsHeaderFormValues } from "@/features/content-management/types";

type StatisticsHeaderFormMessages = {
  contentArRequired: string;
  contentEnRequired: string;
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

export function createStatisticsHeaderFormSchema(
  messages: StatisticsHeaderFormMessages,
) {
  return z.object({
    contentAr: z.string().trim().min(1, messages.contentArRequired),
    contentEn: z.string().trim().min(1, messages.contentEnRequired),
    titleAr: requiredRichText(messages.titleArRequired),
    titleEn: requiredRichText(messages.titleEnRequired),
    descriptionAr: z.string().trim().min(1, messages.descriptionArRequired),
    descriptionEn: z.string().trim().min(1, messages.descriptionEnRequired),
  });
}

export type StatisticsHeaderFormSchema = z.infer<
  ReturnType<typeof createStatisticsHeaderFormSchema>
>;

export const EMPTY_STATISTICS_HEADER_FORM_VALUES: StatisticsHeaderFormValues = {
  contentAr: "",
  contentEn: "",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
};
