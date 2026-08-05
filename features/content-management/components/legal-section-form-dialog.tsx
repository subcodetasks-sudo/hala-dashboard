"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLegalSection } from "@/features/content-management/queries/use-create-legal-section";
import { useUpdateLegalSection } from "@/features/content-management/queries/use-update-legal-section";
import {
  createLegalSectionFormSchema,
  EMPTY_LEGAL_SECTION_FORM_VALUES,
} from "@/features/content-management/schemas/legal-section-form-schema";
import type {
  LegalPageKind,
  LegalSectionFormValues,
  LegalSectionRow,
} from "@/features/content-management/types";

type LegalSectionFormDialogProps = {
  page: LegalPageKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: LegalSectionRow | null;
};

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

export default function LegalSectionFormDialog({
  page,
  open,
  onOpenChange,
  item = null,
}: LegalSectionFormDialogProps) {
  const t = useTranslations("ContentManagement.legal.sections.formDialog");
  const createItem = useCreateLegalSection(page);
  const updateItem = useUpdateLegalSection(page);
  const isEdit = Boolean(item);

  const schema = useMemo(
    () =>
      createLegalSectionFormSchema({
        titleArRequired: t("validation.titleArRequired"),
        titleEnRequired: t("validation.titleEnRequired"),
        contentArRequired: t("validation.contentArRequired"),
        contentEnRequired: t("validation.contentEnRequired"),
        descriptionArRequired: t("validation.descriptionArRequired"),
        descriptionEnRequired: t("validation.descriptionEnRequired"),
        sortOrderRequired: t("validation.sortOrderRequired"),
        sortOrderInvalid: t("validation.sortOrderInvalid"),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LegalSectionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_LEGAL_SECTION_FORM_VALUES,
  });

  const isPending = createItem.isPending || updateItem.isPending;

  useEffect(() => {
    if (!open) return;

    reset(
      item
        ? {
            titleAr: item.titleAr,
            titleEn: item.titleEn,
            contentAr: toEditorContent(item.contentAr),
            contentEn: toEditorContent(item.contentEn),
            descriptionAr: item.descriptionAr,
            descriptionEn: item.descriptionEn,
            sortOrder: String(item.sortOrder),
          }
        : EMPTY_LEGAL_SECTION_FORM_VALUES,
    );
  }, [open, item, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isPending) return;
      reset(EMPTY_LEGAL_SECTION_FORM_VALUES);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = handleSubmit((values) => {
    if (isEdit && item) {
      updateItem.mutate(
        { id: item.id, values },
        {
          onSuccess: (payload) => {
            toast.success(payload.message || t("toastUpdated"));
            reset(EMPTY_LEGAL_SECTION_FORM_VALUES);
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error(
              error instanceof Error && error.message
                ? error.message
                : t("errorToast"),
            );
          },
        },
      );
      return;
    }

    createItem.mutate(
      { values },
      {
        onSuccess: (payload) => {
          toast.success(payload.message || t("toastCreated"));
          reset(EMPTY_LEGAL_SECTION_FORM_VALUES);
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error && error.message
              ? error.message
              : t("errorToast"),
          );
        },
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-xl border-none bg-white p-0 ring-0 sm:max-w-5xl max-h-[90vh]"
      >
        <div className="flex min-w-0 items-center justify-between gap-3 px-5 py-4">
          <DialogTitle className="min-w-0 truncate text-base font-bold text-brand-black">
            {isEdit ? t("editTitle") : t("createTitle")}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              aria-label={t("close")}
              className="size-9 shrink-0 rounded-xl bg-brand-background p-0 text-brand-gris hover:bg-brand-background/80 hover:text-brand-black"
            >
              <X className="size-4" strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        <div className="mx-auto w-9/10 border-b border-black/10" />

        <form
          className="flex min-w-0 flex-col gap-4 px-5 py-5"
          onSubmit={onSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor={`${page}-section-title-ar`}
                className="text-sm font-semibold text-brand-black"
              >
                {t("titleArLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id={`${page}-section-title-ar`}
                dir="rtl"
                disabled={isPending}
                placeholder={t("titleArPlaceholder")}
                aria-invalid={Boolean(errors.titleAr)}
                className={FIELD_CLASS}
                {...register("titleAr")}
              />
              {errors.titleAr ? (
                <p className="text-xs text-brand-accent">
                  {errors.titleAr.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor={`${page}-section-title-en`}
                className="text-sm font-semibold text-brand-black"
              >
                {t("titleEnLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id={`${page}-section-title-en`}
                dir="ltr"
                disabled={isPending}
                placeholder={t("titleEnPlaceholder")}
                aria-invalid={Boolean(errors.titleEn)}
                className={FIELD_CLASS}
                {...register("titleEn")}
              />
              {errors.titleEn ? (
                <p className="text-xs text-brand-accent">
                  {errors.titleEn.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor={`${page}-section-description-ar`}
                className="text-sm font-semibold text-brand-black"
              >
                {t("descriptionArLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Textarea
                id={`${page}-section-description-ar`}
                dir="rtl"
                disabled={isPending}
                placeholder={t("descriptionArPlaceholder")}
                aria-invalid={Boolean(errors.descriptionAr)}
                className={TEXTAREA_CLASS}
                {...register("descriptionAr")}
              />
              {errors.descriptionAr ? (
                <p className="text-xs text-brand-accent">
                  {errors.descriptionAr.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor={`${page}-section-description-en`}
                className="text-sm font-semibold text-brand-black"
              >
                {t("descriptionEnLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Textarea
                id={`${page}-section-description-en`}
                dir="ltr"
                disabled={isPending}
                placeholder={t("descriptionEnPlaceholder")}
                aria-invalid={Boolean(errors.descriptionEn)}
                className={TEXTAREA_CLASS}
                {...register("descriptionEn")}
              />
              {errors.descriptionEn ? (
                <p className="text-xs text-brand-accent">
                  {errors.descriptionEn.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor={`${page}-section-content-ar`}
                className="text-sm font-semibold text-brand-black"
              >
                {t("contentArLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Controller
                control={control}
                name="contentAr"
                render={({ field }) => (
                  <RichTextEditor
                    id={`${page}-section-content-ar`}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("contentArPlaceholder")}
                    disabled={isPending}
                    invalid={Boolean(errors.contentAr)}
                    minHeightClassName="min-h-36"
                    showCharacterCount={false}
                  />
                )}
              />
              {errors.contentAr ? (
                <p className="text-xs text-brand-accent">
                  {errors.contentAr.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor={`${page}-section-content-en`}
                className="text-sm font-semibold text-brand-black"
              >
                {t("contentEnLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Controller
                control={control}
                name="contentEn"
                render={({ field }) => (
                  <RichTextEditor
                    id={`${page}-section-content-en`}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("contentEnPlaceholder")}
                    disabled={isPending}
                    invalid={Boolean(errors.contentEn)}
                    minHeightClassName="min-h-36"
                    showCharacterCount={false}
                  />
                )}
              />
              {errors.contentEn ? (
                <p className="text-xs text-brand-accent">
                  {errors.contentEn.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor={`${page}-section-sort-order`}
              className="text-sm font-semibold text-brand-black"
            >
              {t("sortOrderLabel")}{" "}
              <span className="text-brand-accent" aria-hidden>
                *
              </span>
            </Label>
            <Input
              id={`${page}-section-sort-order`}
              type="number"
              min={0}
              disabled={isPending}
              placeholder={t("sortOrderPlaceholder")}
              aria-invalid={Boolean(errors.sortOrder)}
              className={FIELD_CLASS}
              {...register("sortOrder")}
            />
            {errors.sortOrder ? (
              <p className="text-xs text-brand-accent">
                {errors.sortOrder.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
              className="h-11 rounded-full border-black/10 px-6 text-brand-black"
            >
              {t("cancel")}
            </Button>
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
                  <span className="tracking-wide">
                    {isEdit ? t("save") : t("create")}
                  </span>
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
      </DialogContent>
    </Dialog>
  );
}
