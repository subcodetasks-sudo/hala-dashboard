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
import LegalSectionsSection from "@/features/content-management/components/legal-sections-section";
import { useLegalHeader } from "@/features/content-management/queries/use-legal-header";
import { useUpsertLegalHeader } from "@/features/content-management/queries/use-upsert-legal-header";
import {
  createLegalHeaderFormSchema,
  EMPTY_LEGAL_HEADER_FORM_VALUES,
} from "@/features/content-management/schemas/legal-header-form-schema";
import type {
  LegalHeaderApiItem,
  LegalHeaderFormValues,
  LegalPageKind,
} from "@/features/content-management/types";

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

function toFormValues(
  header: LegalHeaderApiItem | null | undefined,
): LegalHeaderFormValues {
  if (!header) return EMPTY_LEGAL_HEADER_FORM_VALUES;

  return {
    contentAr: header.content?.ar ?? "",
    contentEn: header.content?.en ?? "",
    titleAr: toEditorContent(header.title?.ar),
    titleEn: toEditorContent(header.title?.en),
    descriptionAr: header.description?.ar ?? "",
    descriptionEn: header.description?.en ?? "",
  };
}

type LegalPagePanelProps = {
  page: LegalPageKind;
};

export default function LegalPagePanel({ page }: LegalPagePanelProps) {
  const t = useTranslations("ContentManagement.legal");
  const tTabs = useTranslations("ContentManagement.sectionTabs");
  const { data: header, isLoading, isError, error, refetch } =
    useLegalHeader(page);
  const upsertHeader = useUpsertLegalHeader(page);

  const formValues = useMemo(() => toFormValues(header), [header]);

  const schema = useMemo(
    () =>
      createLegalHeaderFormSchema({
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
  } = useForm<LegalHeaderFormValues>({
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
    return <LegalPagePanelSkeleton />;
  }

  return (
    <SectionHeaderContentTabs
      headerLabel={tTabs("header")}
      contentLabel={tTabs("content")}
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
              {t(`pages.${page}.formTitle`)}
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                id={`${page}-contentAr`}
                label={t("contentArLabel")}
                error={errors.contentAr?.message}
              >
                <Input
                  id={`${page}-contentAr`}
                  dir="rtl"
                  className={FIELD_CLASS}
                  placeholder={t("contentArPlaceholder")}
                  disabled={isPending}
                  {...register("contentAr")}
                />
              </Field>
              <Field
                id={`${page}-contentEn`}
                label={t("contentEnLabel")}
                error={errors.contentEn?.message}
              >
                <Input
                  id={`${page}-contentEn`}
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
                id={`${page}-titleAr`}
                label={t("titleArLabel")}
                error={errors.titleAr?.message}
              >
                <Controller
                  control={control}
                  name="titleAr"
                  render={({ field }) => (
                    <RichTextEditor
                      id={`${page}-titleAr`}
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
                id={`${page}-titleEn`}
                label={t("titleEnLabel")}
                error={errors.titleEn?.message}
              >
                <Controller
                  control={control}
                  name="titleEn"
                  render={({ field }) => (
                    <RichTextEditor
                      id={`${page}-titleEn`}
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
                id={`${page}-descriptionAr`}
                label={t("descriptionArLabel")}
                error={errors.descriptionAr?.message}
              >
                <Textarea
                  id={`${page}-descriptionAr`}
                  dir="rtl"
                  className={TEXTAREA_CLASS}
                  placeholder={t("descriptionArPlaceholder")}
                  disabled={isPending}
                  {...register("descriptionAr")}
                />
              </Field>
              <Field
                id={`${page}-descriptionEn`}
                label={t("descriptionEnLabel")}
                error={errors.descriptionEn?.message}
              >
                <Textarea
                  id={`${page}-descriptionEn`}
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
      content={<LegalSectionsSection page={page} />}
    />
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

function LegalPagePanelSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-6" aria-busy="true">
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
