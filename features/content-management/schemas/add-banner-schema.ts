import { z } from "zod";

type AddBannerSchemaMessages = {
  titleRequired: string;
  alertTextRequired: string;
  appearanceRequired: string;
  alertTypeRequired: string;
  startDateRequired: string;
  endDateRequired: string;
  endDateAfterStart: string;
  statusRequired: string;
};

export function createAddBannerSchema(messages: AddBannerSchemaMessages) {
  return z
    .object({
      title: z.string().trim().min(1, messages.titleRequired),
      alertText: z.string().trim().min(1, messages.alertTextRequired),
      appearance: z.enum(["siteTop", "homeBanner"], {
        message: messages.appearanceRequired,
      }),
      alertType: z.enum(["warning", "info", "success"], {
        message: messages.alertTypeRequired,
      }),
      startDate: z.string().trim().min(1, messages.startDateRequired),
      endDate: z.string().trim().min(1, messages.endDateRequired),
      status: z.enum(["published", "draft"], {
        message: messages.statusRequired,
      }),
    })
    .refine(
      (values) =>
        !values.startDate ||
        !values.endDate ||
        values.endDate >= values.startDate,
      {
        message: messages.endDateAfterStart,
        path: ["endDate"],
      }
    );
}
