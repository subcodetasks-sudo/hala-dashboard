import { z } from "zod";

import { toSaudiPhoneLocal } from "@/features/orders/mock-data";

export type EmployerFormValues = {
  employerName: string;
  nationalId: string;
  phoneLocal: string;
  city: string;
  address: string;
};

export type EmployerValidationMessages = {
  employerNameRequired: string;
  nationalIdRequired: string;
  nationalIdFormat: string;
  phoneRequired: string;
  phoneFormat: string;
  cityRequired: string;
  addressRequired: string;
};

export function createEmployerSchema(messages: EmployerValidationMessages) {
  return z.object({
    employerName: z.string().trim().min(1, messages.employerNameRequired),
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
    city: z.string().trim().min(1, messages.cityRequired),
    address: z.string().trim().min(1, messages.addressRequired),
  });
}
