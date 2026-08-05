import { z } from "zod";

import type { FaqItemFormValues } from "@/features/content-management/types";

type FaqItemFormMessages = {
  questionArRequired: string;
  questionEnRequired: string;
  answerArRequired: string;
  answerEnRequired: string;
  sortOrderRequired: string;
  sortOrderInvalid: string;
};

export function createFaqItemFormSchema(messages: FaqItemFormMessages) {
  return z.object({
    questionAr: z.string().trim().min(1, messages.questionArRequired),
    questionEn: z.string().trim().min(1, messages.questionEnRequired),
    answerAr: z.string().trim().min(1, messages.answerArRequired),
    answerEn: z.string().trim().min(1, messages.answerEnRequired),
    sortOrder: z
      .string()
      .trim()
      .min(1, messages.sortOrderRequired)
      .refine((value) => /^\d+$/.test(value) && Number(value) >= 0, {
        message: messages.sortOrderInvalid,
      }),
  });
}

export type FaqItemFormSchema = z.infer<
  ReturnType<typeof createFaqItemFormSchema>
>;

export const EMPTY_FAQ_ITEM_FORM_VALUES: FaqItemFormValues = {
  questionAr: "",
  questionEn: "",
  answerAr: "",
  answerEn: "",
  sortOrder: "1",
};

export const FAQS_ITEMS_PER_PAGE = 15;
