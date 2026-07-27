"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import ReviewFormPhoneField from "@/components/phone-field";
import ReviewFormSelectField from "@/components/select-field";
import ReviewFormTextField from "@/components/text-field";
import ReviewFormSectionHeader from "@/features/orders/components/section-header";
import { SAUDI_CITIES } from "@/features/orders/mock-data";
import type { OrderReviewDetail } from "@/features/orders/types";
import {
  createEmployerSchema,
  type EmployerFormValues,
} from "@/features/orders/schemas/employer-schema";

type EmployerDataPanelProps = {
  order: OrderReviewDetail;
  isEditing: boolean;
  onEditingChange: (editing: boolean) => void;
  onSaved?: (values: EmployerFormValues) => void;
};

export default function EmployerDataPanel({
  order,
  isEditing,
  onEditingChange,
  onSaved,
}: EmployerDataPanelProps) {
  const t = useTranslations("Orders.New.Review.employer");
  const tValidation = useTranslations("Orders.New.Review.validation");

  const schema = useMemo(
    () =>
      createEmployerSchema({
        employerNameRequired: tValidation("employerNameRequired"),
        nationalIdRequired: tValidation("nationalIdRequired"),
        nationalIdFormat: tValidation("nationalIdFormat"),
        phoneRequired: tValidation("phoneRequired"),
        phoneFormat: tValidation("phoneFormat"),
        cityRequired: tValidation("cityRequired"),
        addressRequired: tValidation("addressRequired"),
      }),
    [tValidation]
  );

  const defaultValues: EmployerFormValues = useMemo(
    () => ({
      employerName: order.employerName,
      nationalId: order.nationalId,
      phoneLocal: order.phoneLocal,
      city: order.city,
      address: order.address,
    }),
    [order]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployerFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (values: EmployerFormValues) => {
    onSaved?.(values);
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
        iconSrc="/svg/personalcard.svg"
        isEditing={isEditing}
        editLabel={t("edit")}
        saveLabel={t("save")}
        cancelLabel={t("cancel")}
        onEdit={() => onEditingChange(true)}
        onSave={handleSubmit(onSubmit)}
        onCancel={handleCancel}
      />

      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <ReviewFormTextField
          id="employerName"
          label={t("employerName")}
          iconSrc="/svg/person.svg"
          readOnly={!isEditing}
          error={errors.employerName}
          {...register("employerName")}
        />

        <ReviewFormTextField
          id="nationalId"
          label={t("nationalId")}
          iconSrc="/svg/identity-2.svg"
          readOnly={!isEditing}
          error={errors.nationalId}
          inputMode="numeric"
          maxLength={10}
          {...register("nationalId", {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            },
          })}
        />

        <Controller
          name="phoneLocal"
          control={control}
          render={({ field }) => (
            <ReviewFormPhoneField
              id="phoneLocal"
              label={t("phone")}
              readOnly={!isEditing}
              error={errors.phoneLocal}
              placeholder={t("phonePlaceholder")}
              className="md:col-span-2"
              field={field}
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <ReviewFormSelectField
              id="city"
              label={t("city")}
              iconSrc="/svg/location.svg"
              value={field.value}
              onChange={field.onChange}
              readOnly={!isEditing}
              error={errors.city}
              options={SAUDI_CITIES}
            />
          )}
        />

        <ReviewFormTextField
          id="address"
          label={t("address")}
          iconSrc="/svg/clipboard.svg"
          readOnly={!isEditing}
          error={errors.address}
          {...register("address")}
        />
      </form>
    </div>
  );
}
