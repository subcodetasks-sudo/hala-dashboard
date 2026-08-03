import { z } from "zod";

type AddFaqSchemaMessages = {
  questionRequired: string;
  answerRequired: string;
  appearanceRequired: string;
  displayOrderRequired: string;
  statusRequired: string;
};

export function createAddFaqSchema(messages: AddFaqSchemaMessages) {
  return z.object({
    question: z.string().trim().min(1, messages.questionRequired),
    answer: z.string().trim().min(1, messages.answerRequired),
    appearance: z.enum(["homePage", "supportPage"], {
      message: messages.appearanceRequired,
    }),
    displayOrder: z.string().trim().min(1, messages.displayOrderRequired),
    status: z.enum(["published", "draft"], {
      message: messages.statusRequired,
    }),
  });
}

export type AddFaqSchema = ReturnType<typeof createAddFaqSchema>;
