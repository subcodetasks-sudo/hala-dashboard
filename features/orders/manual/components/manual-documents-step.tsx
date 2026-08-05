"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, SaudiRiyal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import ReviewFormTextField from "@/components/text-field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReviewFormSectionHeader from "@/features/orders/components/section-header";
import ManualFileUploadField from "@/features/orders/manual/components/manual-file-upload-field";
import ManualStepFooter from "@/features/orders/manual/components/manual-step-footer";
import type { ManualDocumentsValues } from "@/features/orders/manual/types";
import {
  createManualDocumentsSchema,
  type ManualDocumentsFormValues,
} from "@/features/orders/schemas/manual-documents-schema";

export const EMPTY_DOCUMENTS_VALUES: ManualDocumentsFormValues = {
  nationalIdImage: null,
  workerIdImage: null,
  passportImage: null,
  exitReentryVisa: null,
  salary: "0.00",
};

type ManualDocumentsStepProps = {
  defaultValues?: ManualDocumentsFormValues;
  onBack: () => void;
  onNext: (values: ManualDocumentsValues) => void;
};

export default function ManualDocumentsStep({
  defaultValues = EMPTY_DOCUMENTS_VALUES,
  onBack,
  onNext,
}: ManualDocumentsStepProps) {
  const t = useTranslations("Orders.Manual.documents");
  const tReviewDocs = useTranslations("Orders.New.Review.documents");

  const schema = useMemo(
    () =>
      createManualDocumentsSchema({
        nationalIdImageRequired: t("validation.nationalIdImageRequired"),
        workerIdImageRequired: t("validation.workerIdImageRequired"),
        passportImageRequired: t("validation.passportImageRequired"),
        exitReentryVisaRequired: t("validation.exitReentryVisaRequired"),
        salaryRequired: t("validation.salaryRequired"),
        salaryFormat: t("validation.salaryFormat"),
        fileTypeInvalid: t("validation.fileTypeInvalid"),
      }),
    [t]
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualDocumentsFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = (values: ManualDocumentsFormValues) => {
    if (
      !(values.nationalIdImage instanceof File) ||
      !(values.workerIdImage instanceof File) ||
      !(values.passportImage instanceof File) ||
      !(values.exitReentryVisa instanceof File)
    ) {
      return;
    }

    onNext({
      nationalIdImage: values.nationalIdImage,
      workerIdImage: values.workerIdImage,
      passportImage: values.passportImage,
      exitReentryVisa: values.exitReentryVisa,
      salary: values.salary.trim(),
    });
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <ReviewFormSectionHeader
        title={t("sectionTitle")}
        iconSrc="/svg/shield-tick.svg"
        canEdit={false}
      />

      <div className="flex flex-col gap-4">
        <Controller
          name="nationalIdImage"
          control={control}
          render={({ field }) => (
            <ManualFileUploadField
              id="nationalIdImage"
              label={tReviewDocs("types.nationalId")}
              uploadLabel={tReviewDocs("uploadLabel")}
              formatsLabel={t("uploadFormats")}
              value={field.value}
              onChange={field.onChange}
              required
              error={errors.nationalIdImage}
            />
          )}
        />

        <Controller
          name="workerIdImage"
          control={control}
          render={({ field }) => (
            <ManualFileUploadField
              id="workerIdImage"
              label={t("workerId")}
              uploadLabel={tReviewDocs("uploadLabel")}
              formatsLabel={t("uploadFormats")}
              value={field.value}
              onChange={field.onChange}
              required
              error={errors.workerIdImage}
            />
          )}
        />

        <Controller
          name="passportImage"
          control={control}
          render={({ field }) => (
            <ManualFileUploadField
              id="passportImage"
              label={t("passportCombined")}
              uploadLabel={tReviewDocs("uploadLabel")}
              formatsLabel={t("uploadFormats")}
              value={field.value}
              onChange={field.onChange}
              required
              error={errors.passportImage}
              labelAddon={
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex text-brand-gris transition-colors hover:text-brand-primary"
                        aria-label={t("passportCombinedHint")}
                      >
                        <Info className="size-3.5" strokeWidth={2} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">
                      {t("passportCombinedHint")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              }
            />
          )}
        />

        <Controller
          name="exitReentryVisa"
          control={control}
          render={({ field }) => (
            <ManualFileUploadField
              id="exitReentryVisa"
              label={tReviewDocs("types.exitReentryVisa")}
              uploadLabel={tReviewDocs("uploadLabel")}
              formatsLabel={t("uploadFormats")}
              value={field.value}
              onChange={field.onChange}
              required
              error={errors.exitReentryVisa}
            />
          )}
        />

        <ReviewFormTextField
          id="salary"
          label={t("salary")}
          type="number"
          iconSrc="/svg/money-recive.svg"
          readOnly={false}
          required
          error={errors.salary}
          inputMode="decimal"
          placeholder={t("salaryPlaceholder")}
          className="font-clash"
          inputClassName="h-14"
          endAdornment={
            <SaudiRiyal
              className="size-4 shrink-0 text-brand-primary"
              strokeWidth={1.75}
            />
          }
          {...register("salary")}
        />
      </div>

      <ManualStepFooter onBack={onBack} />
    </form>
  );
}
