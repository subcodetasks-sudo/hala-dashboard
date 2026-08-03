import { z } from "zod";

type AddBlogSchemaMessages = {
  titleRequired: string;
  summaryRequired: string;
  keywordsRequired: string;
  categoryRequired: string;
  statusRequired: string;
  authorRequired: string;
  readingTimeRequired: string;
  contentRequired: string;
};

export function createAddBlogSchema(messages: AddBlogSchemaMessages) {
  return z.object({
    title: z.string().trim().min(1, messages.titleRequired),
    summary: z.string().trim().min(1, messages.summaryRequired),
    keywords: z.string().trim().min(1, messages.keywordsRequired),
    category: z.enum(["blog"], { message: messages.categoryRequired }),
    status: z.enum(["published", "draft"], {
      message: messages.statusRequired,
    }),
    author: z.string().trim().min(1, messages.authorRequired),
    readingTime: z.string().trim().min(1, messages.readingTimeRequired),
    content: z.string().trim().min(1, messages.contentRequired),
  });
}
