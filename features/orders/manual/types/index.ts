import type { UpdateEmployerInput } from "@/features/orders/schemas/employer-schema";
import type { ManualDocumentsFormValues } from "@/features/orders/schemas/manual-documents-schema";
import type { WorkerFormValues } from "@/features/orders/schemas/worker-schema";

export const MANUAL_ORDER_STEPS = [
  "employer",
  "worker",
  "documents",
  "review",
] as const;

export type ManualOrderStepId = (typeof MANUAL_ORDER_STEPS)[number];

export type ManualWorkerValues = WorkerFormValues & {
  passportIssuePlaceId: number;
};

export type ManualDocumentsValues = {
  nationalIdImage: File;
  workerIdImage: File;
  passportImage: File;
  exitReentryVisa: File;
  salary: string;
};

/** Values collected across the wizard until the order is submitted. */
export type ManualOrderDraft = {
  /** Set once the create-order API returns an id. */
  orderId?: string | number | null;
  employer?: UpdateEmployerInput;
  worker?: ManualWorkerValues;
  documents?: ManualDocumentsFormValues;
};
