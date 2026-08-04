"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import ReviewFormComboboxField from "@/components/combobox-field";
import ReviewFormPhoneField from "@/components/phone-field";
import ReviewFormTextField from "@/components/text-field";
import ReviewFormSectionHeader from "@/features/orders/components/section-header";
import { getCityLabel, useCities } from "@/features/orders/queries/use-cities";
import {
  getPassportIssuePlaceLabel,
  usePassportIssuePlaces,
} from "@/features/orders/queries/use-passport-issue-places";
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

function displayOrEmpty(value: string): string {
  return value === "—" ? "" : value;
}

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
  const {
    data: issuePlaces = [],
    isLoading: isIssuePlacesLoading,
  } = usePassportIssuePlaces({ country: "sa" });

  const schema = useMemo(
    () =>
      createEmployerSchema({
        employerNameArRequired: tValidation("employerNameArRequired"),
        employerNameEnRequired: tValidation("employerNameEnRequired"),
        nationalIdRequired: tValidation("nationalIdRequired"),
        nationalIdFormat: tValidation("nationalIdFormat"),
        phoneRequired: tValidation("phoneRequired"),
        phoneFormat: tValidation("phoneFormat"),
        cityRequired: tValidation("cityRequired"),
      }),
    [tValidation]
  );

  const defaultValues: EmployerFormValues = useMemo(
    () => ({
      nationalId: displayOrEmpty(order.nationalId),
      phoneLocal: order.phoneLocal,
      employerNameAr: displayOrEmpty(order.employerNameAr),
      employerNameEn: displayOrEmpty(order.employerNameEn),
      city: displayOrEmpty(order.city),
      passportIssuePlace: displayOrEmpty(order.passportIssuePlace),
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
  const selectedIssuePlace = watch("passportIssuePlace");

  const cityOptions = useMemo(() => {
    const options = cities.map((city) => {
      const label = getCityLabel(city, locale);
      return { value: label, label };
    });

    const selected = selectedCity?.trim();
    if (
      selected &&
      selected !== "—" &&
      !options.some((option) => option.value === selected)
    ) {
      return [{ value: selected, label: selected }, ...options];
    }

    return options;
  }, [cities, locale, selectedCity]);

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
          id="nationalId"
          label={t("nationalId")}
          iconSrc="/svg/identity-2.svg"
          readOnly={!editing}
          error={errors.nationalId}
          placeholder={t("nationalIdPlaceholder")}
          inputMode="numeric"
          maxLength={10}
          className="font-clash"
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
              field={field}
            />
          )}
        />

        <ReviewFormTextField
          id="employerNameAr"
          label={t("employerNameAr")}
          iconSrc="/svg/person.svg"
          readOnly={!editing}
          error={errors.employerNameAr}
          placeholder={t("employerNameArPlaceholder")}
          {...register("employerNameAr")}
        />

        <ReviewFormTextField
          id="employerNameEn"
          label={t("employerNameEn")}
          iconSrc="/svg/person.svg"
          readOnly={!editing}
          error={errors.employerNameEn}
          placeholder={t("employerNameEnPlaceholder")}
          {...register("employerNameEn")}
        />

        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <ReviewFormComboboxField
              id="city"
              label={t("city")}
              iconSrc="/svg/location.svg"
              value={field.value || undefined}
              onChange={field.onChange}
              readOnly={!editing}
              disabled={editing && isCitiesLoading}
              error={errors.city}
              options={cityOptions}
              placeholder={t("cityPlaceholder")}
              emptyMessage={t("comboboxNoResults")}
              variant="form"
            />
          )}
        />

        <Controller
          name="passportIssuePlace"
          control={control}
          render={({ field }) => (
            <ReviewFormComboboxField
              id="passportIssuePlace"
              label={t("passportIssuePlace")}
              iconSrc="/svg/location.svg"
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
      </form>
    </div>
  );
}
