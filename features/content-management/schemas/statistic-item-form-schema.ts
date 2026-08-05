import { z } from "zod";

import type { StatisticItemFormValues } from "@/features/content-management/types";

type StatisticItemFormMessages = {
  descriptionArRequired: string;
  descriptionEnRequired: string;
  numberRequired: string;
  sortOrderRequired: string;
  sortOrderInvalid: string;
};

export function createStatisticItemFormSchema(
  messages: StatisticItemFormMessages,
) {
  return z.object({
    descriptionAr: z.string().trim().min(1, messages.descriptionArRequired),
    descriptionEn: z.string().trim().min(1, messages.descriptionEnRequired),
    number: z.string().trim().min(1, messages.numberRequired),
    sortOrder: z
      .string()
      .trim()
      .min(1, messages.sortOrderRequired)
      .refine((value) => /^\d+$/.test(value) && Number(value) >= 0, {
        message: messages.sortOrderInvalid,
      }),
  });
}

export type StatisticItemFormSchema = z.infer<
  ReturnType<typeof createStatisticItemFormSchema>
>;

export const EMPTY_STATISTIC_ITEM_FORM_VALUES: StatisticItemFormValues = {
  descriptionAr: "",
  descriptionEn: "",
  number: "",
  sortOrder: "1",
};

export const STATISTICS_ITEMS_PER_PAGE = 15;
