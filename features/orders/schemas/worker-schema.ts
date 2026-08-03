import { z } from "zod";

import { toSaudiPhoneLocal } from "@/features/orders/mock-data";

export type WorkerFormValues = {
  workerNameAr: string;
  workerNameEn: string;
  workerPhoneLocal: string;
  birthDate: string;
  homeAddress: string;
  passportIssuePlace: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
};

export type WorkerValidationMessages = {
  workerNameArRequired: string;
  workerNameEnRequired: string;
  workerPhoneRequired: string;
  workerPhoneFormat: string;
  birthDateRequired: string;
  homeAddressRequired: string;
  passportIssuePlaceRequired: string;
  passportNumberRequired: string;
  passportIssueDateRequired: string;
  passportExpiryDateRequired: string;
};

export function createWorkerSchema(messages: WorkerValidationMessages) {
  return z.object({
    workerNameAr: z.string().trim().min(1, messages.workerNameArRequired),
    workerNameEn: z.string().trim().min(1, messages.workerNameEnRequired),
    workerPhoneLocal: z
      .string()
      .trim()
      .min(1, messages.workerPhoneRequired)
      .refine(
        (value) => /^5\d{8}$/.test(toSaudiPhoneLocal(value)),
        messages.workerPhoneFormat
      ),
    birthDate: z.string().trim().min(1, messages.birthDateRequired),
    homeAddress: z.string().trim().min(1, messages.homeAddressRequired),
    passportIssuePlace: z
      .string()
      .trim()
      .min(1, messages.passportIssuePlaceRequired),
    passportNumber: z.string().trim().min(1, messages.passportNumberRequired),
    passportIssueDate: z
      .string()
      .trim()
      .min(1, messages.passportIssueDateRequired),
    passportExpiryDate: z
      .string()
      .trim()
      .min(1, messages.passportExpiryDateRequired),
  });
}
