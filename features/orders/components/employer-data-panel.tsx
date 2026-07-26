"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SaudiPhoneField from "@/features/orders/components/saudi-phone-field";
import {
  SAUDI_CITIES,
  type OrderReviewDetail,
} from "@/features/orders/mock-data";
import {
  createEmployerSchema,
  type EmployerFormValues,
} from "@/features/orders/schemas/employer-schema";
import { cn } from "@/lib/utils";

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-base font-bold text-brand-black">
          <CustomIcon
            src="/svg/user-square.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("sectionTitle")}</span>
        </h3>

        {isEditing ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="h-10 rounded-xl bg-brand-background px-4 font-semibold text-brand-black hover:bg-brand-background/80"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="h-10 gap-2 rounded-xl border-none bg-brand-primary px-4 font-semibold text-brand-white hover:bg-brand-primary/90"
            >
              {t("save")}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => onEditingChange(true)}
            className="h-10 gap-2 rounded-xl border-none bg-brand-primary px-4 font-semibold text-brand-white hover:bg-brand-primary/90"
          >
            <Pencil className="size-4" strokeWidth={1.75} />
            {t("edit")}
          </Button>
        )}
      </div>

      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Field data-invalid={!!errors.employerName || undefined}>
          <FieldLabel htmlFor="employerName">{t("employerName")}</FieldLabel>
          <div className="relative">
            <CustomIcon
              src="/svg/person.svg"
              size={16}
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-brand-gris"
            />
            <Input
              id="employerName"
              readOnly={!isEditing}
              aria-invalid={!!errors.employerName}
              className={cn(
                "h-11 rounded-xl border-black/10 pe-3 ps-9",
                !isEditing && "bg-brand-background/40"
              )}
              {...register("employerName")}
            />
          </div>
          <FieldError errors={[errors.employerName]} />
        </Field>

        <Field data-invalid={!!errors.nationalId || undefined}>
          <FieldLabel htmlFor="nationalId">{t("nationalId")}</FieldLabel>
          <div className="relative">
            <CustomIcon
              src="/svg/personalcard.svg"
              size={16}
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-brand-gris"
            />
            <Input
              id="nationalId"
              inputMode="numeric"
              maxLength={10}
              readOnly={!isEditing}
              aria-invalid={!!errors.nationalId}
              className={cn(
                "h-11 rounded-xl border-black/10 pe-3 ps-9",
                !isEditing && "bg-brand-background/40"
              )}
              {...register("nationalId")}
            />
          </div>
          <FieldError errors={[errors.nationalId]} />
        </Field>

        <Field
          className="md:col-span-2"
          data-invalid={!!errors.phoneLocal || undefined}
        >
          <FieldLabel htmlFor="phoneLocal">{t("phone")}</FieldLabel>
          <Controller
            name="phoneLocal"
            control={control}
            render={({ field }) => (
              <SaudiPhoneField
                id="phoneLocal"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                readOnly={!isEditing}
                placeholder={t("phonePlaceholder")}
                aria-invalid={!!errors.phoneLocal}
                className={cn(!isEditing && "bg-brand-background/40")}
              />
            )}
          />
          <FieldError errors={[errors.phoneLocal]} />
        </Field>

        <Field data-invalid={!!errors.city || undefined}>
          <FieldLabel htmlFor="city">{t("city")}</FieldLabel>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!isEditing}
              >
                <SelectTrigger
                  id="city"
                  aria-invalid={!!errors.city}
                  className={cn(
                    "h-11! w-full rounded-xl border-black/10 px-3",
                    !isEditing && "bg-brand-background/40 opacity-100"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <CustomIcon
                      src="/svg/location.svg"
                      size={16}
                      className="text-brand-gris"
                    />
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start">
                  {SAUDI_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.city]} />
        </Field>

        <Field data-invalid={!!errors.address || undefined}>
          <FieldLabel htmlFor="address">{t("address")}</FieldLabel>
          <div className="relative">
            <CustomIcon
              src="/svg/location.svg"
              size={16}
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-brand-gris"
            />
            <Input
              id="address"
              readOnly={!isEditing}
              aria-invalid={!!errors.address}
              className={cn(
                "h-11 rounded-xl border-black/10 pe-3 ps-9",
                !isEditing && "bg-brand-background/40"
              )}
              {...register("address")}
            />
          </div>
          <FieldError errors={[errors.address]} />
        </Field>
      </form>

      <section className="flex flex-col gap-4">
        <h4 className="flex items-center gap-2 text-base font-bold text-[#0F6873]">
          <CustomIcon
            src="/svg/user-square.svg"
            size={22}
            className="text-[#0F6873]"
          />
          <span>{t("changeHistory")}</span>
        </h4>
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse text-end dir-rtl">
            <TableHeader className="bg-[#E6F3F5] text-brand-black border-none">
              <TableRow className="border-none hover:bg-[#E6F3F5]">
                <TableHead className="h-11 px-4 text-start font-bold text-brand-black border-none">
                  {t("historyEmployee")}
                </TableHead>
                <TableHead className="h-11 px-4 text-center font-bold text-brand-black border-none">
                  {t("historyAction")}
                </TableHead>
                <TableHead className="h-11 px-4 text-end font-bold text-brand-black border-none">
                  {t("historyDateTime")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.changeHistory.map((row) => (
                <TableRow key={row.id} className="border-b border-black/5 hover:bg-transparent">
                  <TableCell className="px-4 py-3.5 text-start border-none">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex size-4 shrink-0 rounded-full border border-black/20" />
                      <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-slate-200">
                        {/* Avatar illustration */}
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                          alt={row.employee}
                          className="size-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-brand-black text-sm">
                        {row.employee}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-center border-none">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5EEFF] px-4 py-1.5 text-xs font-semibold text-[#1B4DFF]">
                      <span className="size-1.5 rounded-full bg-[#1B4DFF]" />
                      {row.actionType === "startReview"
                        ? `${t("actionStartReview")} ..`
                        : row.actionType}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-end border-none">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-sm font-bold text-brand-black">
                        الثلاثاء، 12 يناير 2026
                      </span>
                      <span className="text-xs text-brand-gris/70">
                        10:35 ص <span className="mx-0.5">•</span> منذ 5د
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
