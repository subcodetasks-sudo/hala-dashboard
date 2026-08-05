"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import ReviewFormComboboxField from "@/components/combobox-field";
import ReviewFormPhoneField from "@/components/phone-field";
import ReviewFormTextField from "@/components/text-field";
import ReviewFormSectionHeader from "@/features/orders/components/section-header";
import ManualStepFooter from "@/features/orders/manual/components/manual-step-footer";
import {
  findCityIdByLabel,
  getCityLabel,
  useCities,
} from "@/features/orders/queries/use-cities";
import {
  findPassportIssuePlaceIdByLabel,
  getPassportIssuePlaceLabel,
  usePassportIssuePlaces,
} from "@/features/orders/queries/use-passport-issue-places";
import {
  createEmployerSchema,
  type EmployerFormValues,
  type UpdateEmployerInput,
} from "@/features/orders/schemas/employer-schema";

export const EMPTY_EMPLOYER_VALUES: EmployerFormValues = {
  nationalId: "",
  phoneLocal: "",
  employerNameAr: "",
  employerNameEn: "",
  city: "",
  passportIssuePlace: "",
};

type ManualEmployerStepProps = {
  defaultValues?: EmployerFormValues;
  onNext: (values: UpdateEmployerInput) => void;
};

export default function ManualEmployerStep({
  defaultValues = EMPTY_EMPLOYER_VALUES,
  onNext,
}: ManualEmployerStepProps) {
  const t = useTranslations("Orders.New.Review.employer");
  const tManual = useTranslations("Orders.Manual");
  const tValidation = useTranslations("Orders.New.Review.validation");
  const locale = useLocale();
  const { data: cities = [], isLoading: isCitiesLoading } = useCities();
  const { data: issuePlaces = [], isLoading: isIssuePlacesLoading } =
    usePassportIssuePlaces({ country: "sa" });

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
        passportIssuePlaceRequired: tValidation("passportIssuePlaceRequired"),
      }),
    [tValidation]
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmployerFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  const cityOptions = useMemo(
    () =>
      cities.map((city) => {
        const label = getCityLabel(city, locale);
        return { value: label, label };
      }),
    [cities, locale]
  );

  const issuePlaceOptions = useMemo(
    () =>
      issuePlaces.map((place) => {
        const label = getPassportIssuePlaceLabel(place, locale);
        return { value: label, label };
      }),
    [issuePlaces, locale]
  );

  const onSubmit = (values: EmployerFormValues) => {
    const cityId = findCityIdByLabel(cities, values.city, locale);

    if (cityId == null) {
      setError("city", {
        type: "manual",
        message: tManual("cityNotFound"),
      });
      return;
    }

    const passportIssuePlaceId = findPassportIssuePlaceIdByLabel(
      issuePlaces,
      values.passportIssuePlace,
      locale
    );

    if (passportIssuePlaceId == null) {
      setError("passportIssuePlace", {
        type: "manual",
        message: tManual("passportIssuePlaceNotFound"),
      });
      return;
    }

    onNext({ ...values, cityId, passportIssuePlaceId });
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <ReviewFormSectionHeader
        title={t("sectionTitle")}
        iconSrc="/svg/personalcard.svg"
        canEdit={false}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReviewFormTextField
          id="nationalId"
          label={t("nationalId")}
          iconSrc="/svg/identity-2.svg"
          readOnly={false}
          required
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
              readOnly={false}
              required
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
          readOnly={false}
          required
          error={errors.employerNameAr}
          placeholder={t("employerNameArPlaceholder")}
          {...register("employerNameAr")}
        />

        <ReviewFormTextField
          id="employerNameEn"
          label={t("employerNameEn")}
          iconSrc="/svg/person.svg"
          readOnly={false}
          required
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
              readOnly={false}
              required
              disabled={isCitiesLoading}
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
              readOnly={false}
              disabled={isIssuePlacesLoading}
              error={errors.passportIssuePlace}
              options={issuePlaceOptions}
              placeholder={t("passportIssuePlacePlaceholder")}
              emptyMessage={t("comboboxNoResults")}
              variant="form"
            />
          )}
        />
      </div>

      <ManualStepFooter />
    </form>
  );
}
