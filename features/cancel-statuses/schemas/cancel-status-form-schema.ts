import { z } from "zod";

type CancelStatusFormSchemaMessages = {
  textArRequired: string;
  textEnRequired: string;
};

export function createCancelStatusFormSchema(
  messages: CancelStatusFormSchemaMessages,
) {
  return z.object({
    textAr: z.string().trim().min(1, messages.textArRequired),
    textEn: z.string().trim().min(1, messages.textEnRequired),
    active: z.boolean(),
  });
}

export type CancelStatusFormSchema = ReturnType<
  typeof createCancelStatusFormSchema
>;
