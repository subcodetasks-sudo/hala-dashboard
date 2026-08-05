import { z } from "zod";

import type { StepItemFormValues } from "@/features/content-management/types";

type StepItemFormMessages = {
  stepNumberRequired: string;
  stepNumberInvalid: string;
  stepNameArRequired: string;
  stepNameEnRequired: string;
  titleArRequired: string;
  titleEnRequired: string;
  descriptionArRequired: string;
  descriptionEnRequired: string;
};

export function createStepItemFormSchema(messages: StepItemFormMessages) {
  return z.object({
    stepNumber: z
      .string()
      .trim()
      .min(1, messages.stepNumberRequired)
      .refine((value) => /^\d+$/.test(value) && Number(value) >= 1, {
        message: messages.stepNumberInvalid,
      }),
    stepNameAr: z.string().trim().min(1, messages.stepNameArRequired),
    stepNameEn: z.string().trim().min(1, messages.stepNameEnRequired),
    titleAr: z.string().trim().min(1, messages.titleArRequired),
    titleEn: z.string().trim().min(1, messages.titleEnRequired),
    descriptionAr: z.string().trim().min(1, messages.descriptionArRequired),
    descriptionEn: z.string().trim().min(1, messages.descriptionEnRequired),
  });
}

export type StepItemFormSchema = z.infer<
  ReturnType<typeof createStepItemFormSchema>
>;

export const EMPTY_STEP_ITEM_FORM_VALUES: StepItemFormValues = {
  stepNumber: "1",
  stepNameAr: "",
  stepNameEn: "",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
};
