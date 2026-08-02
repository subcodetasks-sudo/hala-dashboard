"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import DateField from "@/components/date-field";
import ReviewFormPhoneField from "@/components/phone-field";
import ReviewFormSelectField from "@/components/select-field";
import ReviewFormTextField from "@/components/text-field";
import ReviewFormSectionHeader from "@/features/orders/components/section-header";
import { getCityLabel, useCities } from "@/features/orders/queries/use-cities";
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
  onSaved?: (values: WorkerFormValues) => void;
};

export default function WorkerDataPanel({
  order,
  isEditing,
  canEdit = true,
  onEditingChange,
  onSaved,
}: WorkerDataPanelProps) {
  const t = useTranslations("Orders.New.Review.worker");
  const tValidation = useTranslations("Orders.New.Review.validation");
  const locale = useLocale();
  const { data: cities = [], isLoading: isCitiesLoading } = useCities();

  const schema = useMemo(
    () =>
      createWorkerSchema({
        workerNameRequired: tValidation("workerNameRequired"),
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
      workerName: order.workerName,
      workerPhoneLocal: order.workerPhoneLocal,
      birthDate: order.workerBirthDate,
      homeAddress: order.workerHomeAddress,
      passportIssuePlace: order.workerPassportIssuePlace,
      passportNumber: order.workerPassportNumber,
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
    formState: { errors },
  } = useForm<WorkerFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const selectedPassportIssuePlace = watch("passportIssuePlace");

  const cityOptions = useMemo(() => {
    const options = cities.map((city) => {
      const label = getCityLabel(city, locale);
      return { value: label, label };
    });
    const current = selectedPassportIssuePlace?.trim();

    if (
      current &&
      current !== "—" &&
      !options.some((option) => option.value === current)
    ) {
      return [{ value: current, label: current }, ...options];
    }

    return options;
  }, [cities, locale, selectedPassportIssuePlace]);

  const editing = canEdit && isEditing;

  const onSubmit = (values: WorkerFormValues) => {
    if (!canEdit) return;
    onSaved?.(values);
    onEditingChange(false);
  };

  const handleCancel = () => {
    reset(defaultValues);
    onEditingChange(false);
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
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
      />

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Row 1: Worker Name & Phone */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReviewFormTextField
            id="workerName"
            label={t("workerName")}
            iconSrc="/svg/person.svg"
            readOnly={!editing}
            error={errors.workerName}
            {...register("workerName")}
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
        </div>

        {/* Row 2: Birth Date, Home Address, Passport Issue Place */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            {...register("homeAddress")}
          />

          <Controller
            name="passportIssuePlace"
            control={control}
            render={({ field }) => (
              <ReviewFormSelectField
                id="passportIssuePlace"
                label={t("passportIssuePlace")}
                iconSrc="/svg/target.svg"
                value={field.value === "—" ? undefined : field.value}
                onChange={field.onChange}
                readOnly={!editing}
                disabled={editing && isCitiesLoading}
                error={errors.passportIssuePlace}
                options={cityOptions}
              />
            )}
          />
        </div>

        {/* Row 3: Passport Number, Issue Date, Expiry Date */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ReviewFormTextField
            id="passportNumber"
            label={t("passportNumber")}
            iconSrc="/svg/wallet-2.svg"
            readOnly={!editing}
            error={errors.passportNumber}
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
        </div>
      </form>
    </div>
  );
}
