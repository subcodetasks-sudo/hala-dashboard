"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import ReviewFormComboboxField from "@/components/combobox-field";
import DateField from "@/components/date-field";
import ReviewFormPhoneField from "@/components/phone-field";
import ReviewFormTextField from "@/components/text-field";
import ReviewFormSectionHeader from "@/features/orders/components/section-header";
import ManualStepFooter from "@/features/orders/manual/components/manual-step-footer";
import type { ManualWorkerValues } from "@/features/orders/manual/types";
import {
  findPassportIssuePlaceId,
  getPassportIssuePlaceLabel,
  usePassportIssuePlaces,
} from "@/features/orders/queries/use-passport-issue-places";
import {
  createWorkerSchema,
  type WorkerFormValues,
} from "@/features/orders/schemas/worker-schema";

export const EMPTY_WORKER_VALUES: WorkerFormValues = {
  workerNameAr: "",
  workerNameEn: "",
  workerPhoneLocal: "",
  birthDate: "",
  homeAddress: "",
  passportIssuePlace: "",
  passportNumber: "",
  passportIssueDate: "",
  passportExpiryDate: "",
};

type ManualWorkerStepProps = {
  defaultValues?: WorkerFormValues;
  onBack: () => void;
  onNext: (values: ManualWorkerValues) => void;
};

export default function ManualWorkerStep({
  defaultValues = EMPTY_WORKER_VALUES,
  onBack,
  onNext,
}: ManualWorkerStepProps) {
  const t = useTranslations("Orders.New.Review.worker");
  const tManual = useTranslations("Orders.Manual");
  const tValidation = useTranslations("Orders.New.Review.validation");
  const locale = useLocale();
  const { data: issuePlaces = [], isLoading: isIssuePlacesLoading } =
    usePassportIssuePlaces({ country: "ph" });

  const schema = useMemo(
    () =>
      createWorkerSchema({
        workerNameArRequired: tValidation("workerNameArRequired"),
        workerNameEnRequired: tValidation("workerNameEnRequired"),
        workerPhoneRequired: tValidation("workerPhoneRequired"),
        workerPhoneFormat: tValidation("workerPhoneFormat"),
        birthDateRequired: tValidation("birthDateRequired"),
        homeAddressRequired: tValidation("homeAddressRequired"),
        passportIssuePlaceRequired: tValidation("passportIssuePlaceRequired"),
        passportNumberRequired: tValidation("passportNumberRequired"),
        passportIssueDateRequired: tValidation("passportIssueDateRequired"),
        passportExpiryDateRequired: tValidation("passportExpiryDateRequired"),
      }),
    [tValidation]
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<WorkerFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  const issuePlaceOptions = useMemo(
    () =>
      issuePlaces.map((place) => {
        const label = getPassportIssuePlaceLabel(place, locale);
        return { value: label, label };
      }),
    [issuePlaces, locale]
  );

  const [passportIssueDate, passportExpiryDate] = useWatch({
    control,
    name: ["passportIssueDate", "passportExpiryDate"],
  });

  const onSubmit = (values: WorkerFormValues) => {
    const passportIssuePlaceId = findPassportIssuePlaceId(
      values.passportIssuePlace,
      issuePlaces,
      locale
    );

    if (passportIssuePlaceId == null) {
      setError("passportIssuePlace", {
        type: "manual",
        message: tManual("passportIssuePlaceNotFound"),
      });
      return;
    }

    onNext({ ...values, passportIssuePlaceId });
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <ReviewFormSectionHeader
        title={t("sectionTitle")}
        iconSrc="/svg/user-tick.svg"
        canEdit={false}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ReviewFormTextField
          id="workerNameAr"
          label={t("workerNameAr")}
          iconSrc="/svg/person.svg"
          readOnly={false}
          required
          error={errors.workerNameAr}
          placeholder={t("workerNameArPlaceholder")}
          {...register("workerNameAr")}
        />

        <ReviewFormTextField
          id="workerNameEn"
          label={t("workerNameEn")}
          iconSrc="/svg/person.svg"
          readOnly={false}
          required
          error={errors.workerNameEn}
          placeholder={t("workerNameEnPlaceholder")}
          {...register("workerNameEn")}
        />

        <Controller
          name="workerPhoneLocal"
          control={control}
          render={({ field }) => (
            <ReviewFormPhoneField
              id="workerPhoneLocal"
              label={t("workerPhone")}
              readOnly={false}
              required
              error={errors.workerPhoneLocal}
              placeholder={t("phonePlaceholder")}
              field={field}
            />
          )}
        />

        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <DateField
              id="birthDate"
              label={t("birthDate")}
              value={field.value}
              onChange={field.onChange}
              valueAs="iso"
              variant="form"
              required
              maxDate={new Date()}
              error={errors.birthDate}
              iconSrc="/svg/calendar.svg"
            />
          )}
        />

        <ReviewFormTextField
          id="homeAddress"
          label={t("homeAddress")}
          iconSrc="/svg/location.svg"
          readOnly={false}
          error={errors.homeAddress}
          placeholder={t("homeAddressPlaceholder")}
          {...register("homeAddress")}
        />

        <Controller
          name="passportIssuePlace"
          control={control}
          render={({ field }) => (
            <ReviewFormComboboxField
              id="workerPassportIssuePlace"
              label={t("passportIssuePlace")}
              iconSrc="/svg/target.svg"
              value={field.value || undefined}
              onChange={field.onChange}
              readOnly={false}
              required
              disabled={isIssuePlacesLoading}
              error={errors.passportIssuePlace}
              options={issuePlaceOptions}
              placeholder={t("passportIssuePlacePlaceholder")}
              emptyMessage={t("comboboxNoResults")}
              variant="form"
            />
          )}
        />

        <ReviewFormTextField
          id="passportNumber"
          label={t("passportNumber")}
          iconSrc="/svg/wallet-2.svg"
          readOnly={false}
          required
          error={errors.passportNumber}
          placeholder={t("passportNumberPlaceholder")}
          className="font-clash"
          {...register("passportNumber")}
        />

        <Controller
          name="passportIssueDate"
          control={control}
          render={({ field }) => (
            <DateField
              id="passportIssueDate"
              label={t("passportIssueDate")}
              value={field.value}
              onChange={field.onChange}
              valueAs="iso"
              variant="form"
              required
              maxDate={passportExpiryDate || undefined}
              error={errors.passportIssueDate}
              iconSrc="/svg/calendar.svg"
            />
          )}
        />

        <Controller
          name="passportExpiryDate"
          control={control}
          render={({ field }) => (
            <DateField
              id="passportExpiryDate"
              label={t("passportExpiryDate")}
              value={field.value}
              onChange={field.onChange}
              valueAs="iso"
              variant="form"
              required
              minDate={passportIssueDate || undefined}
              error={errors.passportExpiryDate}
              iconSrc="/svg/calendar.svg"
            />
          )}
        />
      </div>

      <ManualStepFooter onBack={onBack} />
    </form>
  );
}
