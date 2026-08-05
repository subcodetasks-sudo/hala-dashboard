"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import ReviewFormComboboxField from "@/components/combobox-field";
import DateField from "@/components/date-field";
import ReviewFormPhoneField from "@/components/phone-field";
import ReviewFormTextField from "@/components/text-field";
import ReviewFormSectionHeader from "@/features/orders/components/section-header";
import {
  getPassportIssuePlaceLabel,
  findPassportIssuePlaceId,
  usePassportIssuePlaces,
} from "@/features/orders/queries/use-passport-issue-places";
import type { OrderReviewDetail } from "@/features/orders/types";
import {
  createWorkerSchema,
  type WorkerFormValues,
} from "@/features/orders/schemas/worker-schema";

type WorkerDataPanelProps = {
  order: OrderReviewDetail;
  isEditing: boolean;
  /** When false, form stays read-only and edit controls are hidden. */
  canEdit?: boolean;
  onEditingChange: (editing: boolean) => void;
  onSaved?: (
    values: WorkerFormValues,
    meta: { passportIssuePlaceId: number },
  ) => void;
  isSaving?: boolean;
};

function displayOrEmpty(value: string): string {
  return value === "—" ? "" : value;
}

export default function WorkerDataPanel({
  order,
  isEditing,
  canEdit = true,
  onEditingChange,
  onSaved,
  isSaving = false,
}: WorkerDataPanelProps) {
  const t = useTranslations("Orders.New.Review.worker");
  const tValidation = useTranslations("Orders.New.Review.validation");
  const locale = useLocale();
  const {
    data: issuePlaces = [],
    isLoading: isIssuePlacesLoading,
  } = usePassportIssuePlaces({ country: "ph" });

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

  const defaultValues: WorkerFormValues = useMemo(
    () => ({
      workerNameAr: displayOrEmpty(order.workerNameAr),
      workerNameEn: displayOrEmpty(order.workerNameEn),
      workerPhoneLocal: order.workerPhoneLocal,
      birthDate: order.workerBirthDate,
      homeAddress: displayOrEmpty(order.workerHomeAddress),
      passportIssuePlace: displayOrEmpty(order.workerPassportIssuePlace),
      passportNumber: displayOrEmpty(order.workerPassportNumber),
      passportIssueDate: order.workerPassportIssueDate,
      passportExpiryDate: order.workerPassportExpiryDate,
    }),
    [order]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<WorkerFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const selectedIssuePlace = watch("passportIssuePlace");

  const issuePlaceOptions = useMemo(() => {
    const options = issuePlaces.map((place) => {
      const label = getPassportIssuePlaceLabel(place, locale);
      return { value: label, label };
    });

    const selected = selectedIssuePlace?.trim();
    if (
      selected &&
      selected !== "—" &&
      !options.some((option) => option.value === selected)
    ) {
      return [{ value: selected, label: selected }, ...options];
    }

    return options;
  }, [issuePlaces, locale, selectedIssuePlace]);

  const editing = canEdit && isEditing;

  const onSubmit = (values: WorkerFormValues) => {
    if (!canEdit) return;

    const passportIssuePlaceId = findPassportIssuePlaceId(
      values.passportIssuePlace,
      issuePlaces,
      locale,
      order.workerPassportIssuePlaceId,
    );

    if (!passportIssuePlaceId) {
      setError("passportIssuePlace", {
        type: "manual",
        message: tValidation("passportIssuePlaceRequired"),
      });
      return;
    }

    onSaved?.(values, { passportIssuePlaceId });
    onEditingChange(false);
  };

  const handleCancel = () => {
    reset(defaultValues);
    onEditingChange(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <ReviewFormSectionHeader
        title={t("sectionTitle")}
        iconSrc="/svg/profile-tick.svg"
        isEditing={editing}
        canEdit={canEdit}
        editLabel={t("edit")}
        saveLabel={t("save")}
        cancelLabel={t("cancel")}
        onEdit={() => onEditingChange(true)}
        onSave={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        isSaving={isSaving}
      />

      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <ReviewFormTextField
          id="workerNameAr"
          label={t("workerNameAr")}
          iconSrc="/svg/person.svg"
          readOnly={!editing}
          error={errors.workerNameAr}
          placeholder={t("workerNameArPlaceholder")}
          {...register("workerNameAr")}
        />

        <ReviewFormTextField
          id="workerNameEn"
          label={t("workerNameEn")}
          iconSrc="/svg/person.svg"
          readOnly={!editing}
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
              readOnly={!editing}
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
              readOnly={!editing}
              error={errors.birthDate}
              iconSrc="/svg/calendar.svg"
            />
          )}
        />

        <ReviewFormTextField
          id="homeAddress"
          label={t("homeAddress")}
          iconSrc="/svg/location.svg"
          readOnly={!editing}
          error={errors.homeAddress}
          placeholder={t("homeAddressPlaceholder")}
          {...register("homeAddress")}
        />

        <Controller
          name="passportIssuePlace"
          control={control}
          render={({ field }) => (
            <ReviewFormComboboxField
              id="passportIssuePlace"
              label={t("passportIssuePlace")}
              iconSrc="/svg/target.svg"
              value={field.value || undefined}
              onChange={field.onChange}
              readOnly={!editing}
              disabled={editing && isIssuePlacesLoading}
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
          readOnly={!editing}
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
              readOnly={!editing}
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
              readOnly={!editing}
              error={errors.passportExpiryDate}
              iconSrc="/svg/calendar.svg"
            />
          )}
        />
      </form>
    </div>
  );
}
