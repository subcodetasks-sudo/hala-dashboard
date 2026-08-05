import { z } from "zod";

import type {
  BlogFilterValues,
  BlogFormValues,
} from "@/features/content-management/types";

type BlogFormMessages = {
  titleArRequired: string;
  titleEnRequired: string;
  contentArRequired: string;
  contentEnRequired: string;
  slugRequired: string;
  statusRequired: string;
  publishedAtRequired: string;
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

export function createBlogFormSchema(messages: BlogFormMessages) {
  return z.object({
    titleAr: z.string().trim().min(1, messages.titleArRequired),
    titleEn: z.string().trim().min(1, messages.titleEnRequired),
    contentAr: requiredRichText(messages.contentArRequired),
    contentEn: requiredRichText(messages.contentEnRequired),
    slug: z.string().trim().min(1, messages.slugRequired),
    status: z.enum(["active", "inactive"], {
      message: messages.statusRequired,
    }),
    publishedAt: z.string().trim().min(1, messages.publishedAtRequired),
  });
}

export type BlogFormSchema = z.infer<ReturnType<typeof createBlogFormSchema>>;

export const EMPTY_BLOG_FORM_VALUES: BlogFormValues = {
  titleAr: "",
  titleEn: "",
  contentAr: "",
  contentEn: "",
  slug: "",
  status: "active",
  publishedAt: "",
};

export const BLOGS_PER_PAGE = 15;

export const DEFAULT_BLOG_FILTERS: BlogFilterValues = {
  search: "",
  status: "all",
};
