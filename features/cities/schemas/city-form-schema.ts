import { z } from "zod";

type CityFormSchemaMessages = {
  nameArRequired: string;
  nameEnRequired: string;
  statusRequired: string;
};

export function createCityFormSchema(messages: CityFormSchemaMessages) {
  return z.object({
    nameAr: z.string().trim().min(1, messages.nameArRequired),
    nameEn: z.string().trim().min(1, messages.nameEnRequired),
    status: z.enum(["active", "inactive"], {
      message: messages.statusRequired,
    }),
  });
}

export type CityFormSchema = ReturnType<typeof createCityFormSchema>;
