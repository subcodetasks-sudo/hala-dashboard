import { z } from "zod";

import { toSaudiPhoneLocal } from "@/features/orders/mock-data";

export type EmployerFormValues = {
  nationalId: string;
  phoneLocal: string;
  employerNameAr: string;
  employerNameEn: string;
  city: string;
  passportIssuePlace: string;
};

export type UpdateEmployerInput = EmployerFormValues & {
  cityId: number;
  passportIssuePlaceId: number;
};

export type EmployerValidationMessages = {
  employerNameArRequired: string;
  employerNameEnRequired: string;
  nationalIdRequired: string;
  nationalIdFormat: string;
  phoneRequired: string;
  phoneFormat: string;
  cityRequired: string;
  passportIssuePlaceRequired: string;
};

export function createEmployerSchema(messages: EmployerValidationMessages) {
  return z.object({
    nationalId: z
      .string()
      .trim()
      .min(1, messages.nationalIdRequired)
      .regex(/^[12]\d{9}$/, messages.nationalIdFormat),
    phoneLocal: z
      .string()
      .trim()
      .min(1, messages.phoneRequired)
      .refine(
        (value) => /^5\d{8}$/.test(toSaudiPhoneLocal(value)),
        messages.phoneFormat
      ),
    employerNameAr: z.string().trim().min(1, messages.employerNameArRequired),
    employerNameEn: z.string().trim().min(1, messages.employerNameEnRequired),
    city: z.string().trim().min(1, messages.cityRequired),
    passportIssuePlace: z
      .string()
      .trim()
      .min(1, messages.passportIssuePlaceRequired),
  });
}
