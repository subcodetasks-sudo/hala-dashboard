"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import ReviewFormPhoneField from "@/components/phone-field";
import ReviewFormSelectField from "@/components/select-field";
import ReviewFormTextField from "@/components/text-field";
import ReviewFormSectionHeader from "@/features/orders/components/section-header";
import { getCityLabel, useCities } from "@/features/orders/queries/use-cities";
import type { OrderReviewDetail } from "@/features/orders/types";
import {
  createEmployerSchema,
  type EmployerFormValues,
} from "@/features/orders/schemas/employer-schema";

type EmployerDataPanelProps = {
  order: OrderReviewDetail;
  isEditing: boolean;
  /** When false, form stays read-only and edit controls are hidden. */
  canEdit?: boolean;
  onEditingChange: (editing: boolean) => void;
  onSaved?: (values: EmployerFormValues) => void;
};

export default function EmployerDataPanel({
  order,
  isEditing,
  canEdit = true,
  onEditingChange,
  onSaved,
}: EmployerDataPanelProps) {
  const t = useTranslations("Orders.New.Review.employer");
  const tValidation = useTranslations("Orders.New.Review.validation");
  const locale = useLocale();
  const { data: cities = [], isLoading: isCitiesLoading } = useCities();

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
    watch,
    formState: { errors },
  } = useForm<EmployerFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const selectedCity = watch("city");

  const cityOptions = useMemo(() => {
    const options = cities.map((city) => {
      const label = getCityLabel(city, locale);
      return { value: label, label };
    });
    const current = selectedCity?.trim();

    if (
      current &&
      current !== "—" &&
      !options.some((option) => option.value === current)
    ) {
      return [{ value: current, label: current }, ...options];
    }

    return options;
  }, [cities, locale, selectedCity]);

  const editing = canEdit && isEditing;

  const onSubmit = (values: EmployerFormValues) => {
    if (!canEdit) return;
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
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <ReviewFormTextField
          id="employerName"
          label={t("employerName")}
          iconSrc="/svg/person.svg"
          readOnly={!editing}
          error={errors.employerName}
          {...register("employerName")}
        />

        <ReviewFormTextField
          id="nationalId"
          label={t("nationalId")}
          iconSrc="/svg/identity-2.svg"
          readOnly={!editing}
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
              readOnly={!editing}
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
              value={field.value === "—" ? undefined : field.value}
              onChange={field.onChange}
              readOnly={!editing}
              disabled={editing && isCitiesLoading}
              error={errors.city}
              options={cityOptions}
            />
          )}
        />

        <ReviewFormTextField
          id="address"
          label={t("address")}
          iconSrc="/svg/clipboard.svg"
          readOnly={!editing}
          error={errors.address}
          {...register("address")}
        />
      </form>
    </div>
  );
}
