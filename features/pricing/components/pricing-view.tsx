"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import SectionHeaderContentTabs from "@/components/section-header-content-tabs";
import PackagesSection from "@/features/pricing/components/packages-section";
import { usePricingHeader } from "@/features/pricing/queries/use-pricing-header";
import { useUpsertPricingHeader } from "@/features/pricing/queries/use-upsert-pricing-header";
import {
  createPricingHeaderFormSchema,
  EMPTY_PRICING_HEADER_FORM_VALUES,
} from "@/features/pricing/schemas/pricing-header-form-schema";
import type {
  PricingHeaderApiItem,
  PricingHeaderFormValues,
} from "@/features/pricing/types";

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const TEXTAREA_CLASS =
  "min-h-24 rounded-2xl border-black/10 bg-[#FBFBFB] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gris/60";

function toEditorContent(value: string | undefined | null): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;
  return `<p>${trimmed}</p>`;
}

function toPlainText(value: string | undefined | null): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  if (!/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;
  return trimmed
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toFormValues(
  header: PricingHeaderApiItem | null | undefined,
): PricingHeaderFormValues {
  if (!header) return EMPTY_PRICING_HEADER_FORM_VALUES;

  return {
    contentAr: header.content?.ar ?? "",
    contentEn: header.content?.en ?? "",
    titleAr: toEditorContent(header.title?.ar),
    titleEn: toEditorContent(header.title?.en),
    descriptionAr: toPlainText(header.description?.ar),
    descriptionEn: toPlainText(header.description?.en),
  };
}

export default function PricingView() {
  const t = useTranslations("Pricing");
  const { data: header, isLoading, isError, error, refetch } =
    usePricingHeader();
  const upsertHeader = useUpsertPricingHeader();

  const formValues = useMemo(() => toFormValues(header), [header]);

  const schema = useMemo(
    () =>
      createPricingHeaderFormSchema({
        contentArRequired: t("validation.contentArRequired"),
        contentEnRequired: t("validation.contentEnRequired"),
        titleArRequired: t("validation.titleArRequired"),
        titleEnRequired: t("validation.titleEnRequired"),
        descriptionArRequired: t("validation.descriptionArRequired"),
        descriptionEnRequired: t("validation.descriptionEnRequired"),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PricingHeaderFormValues>({
    resolver: zodResolver(schema),
    values: formValues,
  });

  const isPending = upsertHeader.isPending;

  const onSubmit = handleSubmit((values) => {
    upsertHeader.mutate(
      { values },
      {
        onSuccess: (payload) => {
          toast.success(payload.message || t("toastSaved"));
        },
        onError: (err) => {
          toast.error(
            err instanceof Error && err.message ? err.message : t("errorToast"),
          );
        },
      },
    );
  });

  if (isLoading) {
    return <PricingHeaderSkeleton />;
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 pb-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-brand-dark-blue">{t("title")}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-brand-gris">
          {t("description")}
        </p>
      </header>

      <SectionHeaderContentTabs
        headerLabel={t("tabs.header")}
        contentLabel={t("tabs.content")}
        header={
          isError ? (
            <div className="flex flex-col items-start gap-3 rounded-[1.75rem] border border-black/5 bg-brand-white p-6">
              <p className="text-sm text-brand-gris">
                {error instanceof Error && error.message
                  ? error.message
                  : t("loadError")}
              </p>
              <Button
                type="button"
                onClick={() => void refetch()}
                className="h-10 rounded-full bg-brand-primary px-5 text-brand-white hover:bg-brand-primary/90"
              >
                {t("retry")}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-6 rounded-[1.75rem] border border-black/5 bg-brand-white p-5 sm:p-6"
            >
              <h2 className="text-lg font-bold text-brand-dark-blue">
                {t("formTitle")}
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  id="contentAr"
                  label={t("contentArLabel")}
                  error={errors.contentAr?.message}
                >
                  <Input
                    id="contentAr"
                    dir="rtl"
                    className={FIELD_CLASS}
                    placeholder={t("contentArPlaceholder")}
                    disabled={isPending}
                    {...register("contentAr")}
                  />
                </Field>
                <Field
                  id="contentEn"
                  label={t("contentEnLabel")}
                  error={errors.contentEn?.message}
                >
                  <Input
                    id="contentEn"
                    dir="ltr"
                    className={FIELD_CLASS}
                    placeholder={t("contentEnPlaceholder")}
                    disabled={isPending}
                    {...register("contentEn")}
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  id="titleAr"
                  label={t("titleArLabel")}
                  error={errors.titleAr?.message}
                >
                  <Controller
                    control={control}
                    name="titleAr"
                    render={({ field }) => (
                      <RichTextEditor
                        id="titleAr"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("titleArPlaceholder")}
                        disabled={isPending}
                        invalid={Boolean(errors.titleAr)}
                        minHeightClassName="min-h-28"
                        showCharacterCount={false}
                      />
                    )}
                  />
                </Field>
                <Field
                  id="titleEn"
                  label={t("titleEnLabel")}
                  error={errors.titleEn?.message}
                >
                  <Controller
                    control={control}
                    name="titleEn"
                    render={({ field }) => (
                      <RichTextEditor
                        id="titleEn"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("titleEnPlaceholder")}
                        disabled={isPending}
                        invalid={Boolean(errors.titleEn)}
                        minHeightClassName="min-h-28"
                        showCharacterCount={false}
                      />
                    )}
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  id="descriptionAr"
                  label={t("descriptionArLabel")}
                  error={errors.descriptionAr?.message}
                >
                  <Textarea
                    id="descriptionAr"
                    dir="rtl"
                    className={TEXTAREA_CLASS}
                    placeholder={t("descriptionArPlaceholder")}
                    disabled={isPending}
                    {...register("descriptionAr")}
                  />
                </Field>
                <Field
                  id="descriptionEn"
                  label={t("descriptionEnLabel")}
                  error={errors.descriptionEn?.message}
                >
                  <Textarea
                    id="descriptionEn"
                    dir="ltr"
                    className={TEXTAREA_CLASS}
                    placeholder={t("descriptionEnPlaceholder")}
                    disabled={isPending}
                    {...register("descriptionEn")}
                  />
                </Field>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="group relative h-11 gap-2 overflow-hidden rounded-full bg-brand-primary px-6 text-brand-white hover:bg-brand-primary/90"
                >
                  {isPending ? (
                    <Spinner className="size-4" />
                  ) : (
                    <>
                      <span
                        className="confirm-chevron-start inline-flex items-center"
                        aria-hidden
                      >
                        <ChevronsLeft
                          className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180"
                          strokeWidth={2.25}
                        />
                      </span>
                      <span className="tracking-wide">{t("save")}</span>
                      <span
                        className="confirm-chevron-end inline-flex items-center"
                        aria-hidden
                      >
                        <ChevronsRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 ltr:rotate-180"
                          strokeWidth={2.25}
                        />
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )
        }
        content={<PackagesSection />}
      />
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-brand-black">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-brand-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PricingHeaderSkeleton() {
  return (
    <div
      className="flex min-w-0 flex-col gap-6 p-4 pb-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-52 bg-brand-primary/15" />
        <Skeleton className="h-4 w-full max-w-xl bg-brand-gris/15" />
      </div>
      <div className="flex flex-col gap-5 rounded-[1.75rem] border border-black/5 bg-brand-white p-5 sm:p-6">
        <Skeleton className="h-6 w-40 bg-brand-primary/15" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full rounded-full bg-brand-gris/10" />
            <Skeleton className="h-11 w-full rounded-full bg-brand-gris/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
