import { z } from "zod";

export type ManualDocumentsFormValues = {
  nationalIdImage: File | null;
  workerIdImage: File | null;
  passportImage: File | null;
  exitReentryVisa: File | null;
  salary: string;
};

export type ManualDocumentsValidationMessages = {
  nationalIdImageRequired: string;
  workerIdImageRequired: string;
  passportImageRequired: string;
  exitReentryVisaRequired: string;
  salaryRequired: string;
  salaryFormat: string;
  fileTypeInvalid: string;
};

const ACCEPTED_MIME_TYPES = new Set([
  "image/png",
  "application/pdf",
]);

const ACCEPTED_EXTENSIONS = [".png", ".pdf"];

function isAcceptedFile(file: File): boolean {
  if (ACCEPTED_MIME_TYPES.has(file.type)) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

function createFileSchema(requiredMessage: string, typeInvalidMessage: string) {
  return z
    .custom<File | null>((value) => value instanceof File || value === null)
    .refine((value) => value instanceof File, requiredMessage)
    .refine(
      (value) => !(value instanceof File) || isAcceptedFile(value),
      typeInvalidMessage
    );
}

export function createManualDocumentsSchema(
  messages: ManualDocumentsValidationMessages
) {
  return z.object({
    nationalIdImage: createFileSchema(
      messages.nationalIdImageRequired,
      messages.fileTypeInvalid
    ),
    workerIdImage: createFileSchema(
      messages.workerIdImageRequired,
      messages.fileTypeInvalid
    ),
    passportImage: createFileSchema(
      messages.passportImageRequired,
      messages.fileTypeInvalid
    ),
    exitReentryVisa: createFileSchema(
      messages.exitReentryVisaRequired,
      messages.fileTypeInvalid
    ),
    salary: z
      .string()
      .trim()
      .min(1, messages.salaryRequired)
      .refine((value) => {
        const normalized = value.replace(/,/g, "");
        const amount = Number(normalized);
        return Number.isFinite(amount) && amount > 0;
      }, messages.salaryFormat),
  });
}
