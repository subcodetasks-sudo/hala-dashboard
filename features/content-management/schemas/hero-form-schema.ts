import { z } from "zod";

import type { HeroFormValues } from "@/features/content-management/types";

type HeroFormMessages = {
  badgeArRequired: string;
  badgeEnRequired: string;
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

export function createHeroFormSchema(messages: HeroFormMessages) {
  return z.object({
    badgeAr: z.string().trim().min(1, messages.badgeArRequired),
    badgeEn: z.string().trim().min(1, messages.badgeEnRequired),
    titleAr: requiredRichText(messages.titleArRequired),
    titleEn: requiredRichText(messages.titleEnRequired),
    descriptionAr: requiredRichText(messages.descriptionArRequired),
    descriptionEn: requiredRichText(messages.descriptionEnRequired),
  });
}

export type HeroFormSchema = z.infer<ReturnType<typeof createHeroFormSchema>>;

export const EMPTY_HERO_FORM_VALUES: HeroFormValues = {
  badgeAr: "",
  badgeEn: "",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
};
