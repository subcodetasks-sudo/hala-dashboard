import { z } from "zod";

type CreateRoleSchemaMessages = {
  nameRequired: string;
  descriptionRequired: string;
  statusRequired: string;
};

export function createRoleFormSchema(messages: CreateRoleSchemaMessages) {
  return z.object({
    name: z.string().trim().min(1, messages.nameRequired),
    description: z.string().trim().min(1, messages.descriptionRequired),
    status: z.enum(["active", "inactive"], {
      message: messages.statusRequired,
    }),
  });
}

export type CreateRoleFieldValues = z.infer<
  ReturnType<typeof createRoleFormSchema>
>;
