import { z } from "zod";

type AddLegalSchemaMessages = {
  pageNameRequired: string;
  statusRequired: string;
  contentRequired: string;
};

export function createAddLegalSchema(messages: AddLegalSchemaMessages) {
  return z.object({
    pageName: z.string().trim().min(1, messages.pageNameRequired),
    status: z.enum(["published", "draft"], {
      message: messages.statusRequired,
    }),
    content: z.string().trim().min(1, messages.contentRequired),
  });
}
