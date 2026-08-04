import { z } from "zod";

type IssuePlaceFormSchemaMessages = {
  nameArRequired: string;
  nameEnRequired: string;
  statusRequired: string;
  countryRequired: string;
};

export function createIssuePlaceFormSchema(
  messages: IssuePlaceFormSchemaMessages,
) {
  return z.object({
    nameAr: z.string().trim().min(1, messages.nameArRequired),
    nameEn: z.string().trim().min(1, messages.nameEnRequired),
    status: z.enum(["active", "inactive"], {
      message: messages.statusRequired,
    }),
    country: z.enum(["sa", "ph"], {
      message: messages.countryRequired,
    }),
  });
}

export type IssuePlaceFormSchema = ReturnType<
  typeof createIssuePlaceFormSchema
>;
