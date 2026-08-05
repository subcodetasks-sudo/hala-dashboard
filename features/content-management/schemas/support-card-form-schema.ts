import { z } from "zod";

import type { SupportCardFormValues } from "@/features/content-management/types";

type SupportCardFormMessages = {
  titleArRequired: string;
  titleEnRequired: string;
  descriptionArRequired: string;
  descriptionEnRequired: string;
  buttonValueRequired: string;
  buttonLabelArRequired: string;
  buttonLabelEnRequired: string;
};

export function createSupportCardFormSchema(messages: SupportCardFormMessages) {
  return z.object({
    titleAr: z.string().trim().min(1, messages.titleArRequired),
    titleEn: z.string().trim().min(1, messages.titleEnRequired),
    descriptionAr: z.string().trim().min(1, messages.descriptionArRequired),
    descriptionEn: z.string().trim().min(1, messages.descriptionEnRequired),
    buttonType: z.enum(["phone", "email"]),
    buttonValue: z.string().trim().min(1, messages.buttonValueRequired),
    buttonLabelAr: z.string().trim().min(1, messages.buttonLabelArRequired),
    buttonLabelEn: z.string().trim().min(1, messages.buttonLabelEnRequired),
  });
}

export type SupportCardFormSchema = z.infer<
  ReturnType<typeof createSupportCardFormSchema>
>;

export function emptySupportCardFormValues(
  buttonType: "phone" | "email",
): SupportCardFormValues {
  return {
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    buttonType,
    buttonValue: "",
    buttonLabelAr: "",
    buttonLabelEn: "",
  };
}
