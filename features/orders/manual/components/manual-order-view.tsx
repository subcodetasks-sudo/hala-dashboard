"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import ManualDocumentsStep from "@/features/orders/manual/components/manual-documents-step";
import ManualEmployerStep from "@/features/orders/manual/components/manual-employer-step";
import ManualOrderStepper from "@/features/orders/manual/components/manual-order-stepper";
import ManualReviewStep from "@/features/orders/manual/components/manual-review-step";
import ManualWorkerStep from "@/features/orders/manual/components/manual-worker-step";
import {
  MANUAL_ORDER_STEPS,
  type ManualDocumentsValues,
  type ManualOrderDraft,
  type ManualWorkerValues,
} from "@/features/orders/manual/types";
import type { UpdateEmployerInput } from "@/features/orders/schemas/employer-schema";

export default function ManualOrderView() {
  const t = useTranslations("Orders.Manual");
  const tReview = useTranslations("Orders.Manual.review");
  const [stepIndex, setStepIndex] = useState(0);
  const [furthestStepIndex, setFurthestStepIndex] = useState(0);
  const [draft, setDraft] = useState<ManualOrderDraft>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = MANUAL_ORDER_STEPS[stepIndex];

  const goToStep = (nextIndex: number) => {
    setStepIndex(nextIndex);
    setFurthestStepIndex((furthest) => Math.max(furthest, nextIndex));
  };

  const handleEmployerNext = (values: UpdateEmployerInput) => {
    setDraft((previous) => ({ ...previous, employer: values }));
    goToStep(1);
  };

  const handleWorkerNext = (values: ManualWorkerValues) => {
    setDraft((previous) => ({ ...previous, worker: values }));
    goToStep(2);
  };

  const handleDocumentsNext = (values: ManualDocumentsValues) => {
    setDraft((previous) => ({ ...previous, documents: values }));
    goToStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // API wiring lands with the create/submit endpoint.
      await new Promise((resolve) => window.setTimeout(resolve, 600));
      toast.success(tReview("successToast"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-black md:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-brand-gris">{t("subtitle")}</p>
      </div>

      <ManualOrderStepper
        currentStepIndex={stepIndex}
        furthestStepIndex={furthestStepIndex}
        onStepSelect={setStepIndex}
      />

      <div className="rounded-2xl border border-black/5 p-6 sm:p-8">
        {currentStep === "employer" ? (
          <ManualEmployerStep
            defaultValues={draft.employer}
            onNext={handleEmployerNext}
          />
        ) : currentStep === "worker" ? (
          <ManualWorkerStep
            defaultValues={draft.worker}
            onBack={() => setStepIndex(0)}
            onNext={handleWorkerNext}
          />
        ) : currentStep === "documents" ? (
          <ManualDocumentsStep
            defaultValues={draft.documents}
            onBack={() => setStepIndex(1)}
            onNext={handleDocumentsNext}
          />
        ) : (
          <ManualReviewStep
            draft={draft}
            onBack={() => setStepIndex(2)}
            onSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
