"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
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
import { useCreateStepItem } from "@/features/content-management/queries/use-create-step-item";
import { useUpdateStepItem } from "@/features/content-management/queries/use-update-step-item";
import {
  createStepItemFormSchema,
  EMPTY_STEP_ITEM_FORM_VALUES,
} from "@/features/content-management/schemas/step-item-form-schema";
import type {
  StepItemFormValues,
  StepItemRow,
} from "@/features/content-management/types";
import { resolveMediaUrl } from "@/lib/resolve-media-url";
import { cn } from "@/lib/utils";

type StepItemFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: StepItemRow | null;
};

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function revokeIfBlob(url: string | undefined) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export default function StepItemFormDialog({
  open,
  onOpenChange,
  item = null,
}: StepItemFormDialogProps) {
  const t = useTranslations("ContentManagement.workSteps.items.formDialog");
  const createItem = useCreateStepItem();
  const updateItem = useUpdateStepItem();
  const isEdit = Boolean(item);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | undefined>();
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | undefined>();
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>();
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const previewUrl = localPreviewUrl ?? existingImageUrl;

  const schema = useMemo(
    () =>
      createStepItemFormSchema({
        stepNumberRequired: t("validation.stepNumberRequired"),
        stepNumberInvalid: t("validation.stepNumberInvalid"),
        stepNameArRequired: t("validation.stepNameArRequired"),
        stepNameEnRequired: t("validation.stepNameEnRequired"),
        titleArRequired: t("validation.titleArRequired"),
        titleEnRequired: t("validation.titleEnRequired"),
        descriptionArRequired: t("validation.descriptionArRequired"),
        descriptionEnRequired: t("validation.descriptionEnRequired"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StepItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_STEP_ITEM_FORM_VALUES,
  });

  const isPending = createItem.isPending || updateItem.isPending;

  useEffect(() => {
    if (!open) return;

    reset(
      item
        ? {
            stepNumber: String(item.stepNumber),
            stepNameAr: item.stepNameAr,
            stepNameEn: item.stepNameEn,
            titleAr: item.titleAr,
            titleEn: item.titleEn,
            descriptionAr: item.descriptionAr,
            descriptionEn: item.descriptionEn,
          }
        : EMPTY_STEP_ITEM_FORM_VALUES,
    );
    setImageFile(undefined);
    setLocalPreviewUrl(undefined);
    setExistingImageUrl(resolveMediaUrl(item?.image));
    setImageLoadFailed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, item, reset]);

  useEffect(() => {
    return () => {
      revokeIfBlob(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const clearLocalPreview = () => {
    revokeIfBlob(localPreviewUrl);
    setLocalPreviewUrl(undefined);
    setImageFile(undefined);
  };

  const handleSelectImage = (file: File) => {
    clearLocalPreview();
    setImageFile(file);
    setLocalPreviewUrl(URL.createObjectURL(file));
    setImageLoadFailed(false);
  };

  const handleRemoveImage = () => {
    clearLocalPreview();
    setExistingImageUrl(undefined);
    setImageLoadFailed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isPending) return;
      clearLocalPreview();
      reset(EMPTY_STEP_ITEM_FORM_VALUES);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = handleSubmit((values) => {
    if (isEdit && item) {
      updateItem.mutate(
        { id: item.id, values, image: imageFile },
        {
          onSuccess: (payload) => {
            toast.success(payload.message || t("toastUpdated"));
            clearLocalPreview();
            reset(EMPTY_STEP_ITEM_FORM_VALUES);
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
      { values, image: imageFile },
      {
        onSuccess: (payload) => {
          toast.success(payload.message || t("toastCreated"));
          clearLocalPreview();
          reset(EMPTY_STEP_ITEM_FORM_VALUES);
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
        className="no-scrollbar w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-xl border-none bg-white p-0 ring-0 sm:max-w-lg max-h-[90vh]"
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

        <form className="flex min-w-0 flex-col gap-4 px-5 py-5" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="step-number" className="text-sm font-semibold text-brand-black">
              {t("stepNumberLabel")} <span className="text-brand-accent" aria-hidden>*</span>
            </Label>
            <Input id="step-number" inputMode="numeric" disabled={isPending} placeholder={t("stepNumberPlaceholder")} aria-invalid={Boolean(errors.stepNumber)} className={FIELD_CLASS} {...register("stepNumber")} />
            {errors.stepNumber ? <p className="text-xs text-brand-accent">{errors.stepNumber.message}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="step-name-ar" className="text-sm font-semibold text-brand-black">
                {t("stepNameArLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input id="step-name-ar" dir="rtl" disabled={isPending} placeholder={t("stepNameArPlaceholder")} aria-invalid={Boolean(errors.stepNameAr)} className={FIELD_CLASS} {...register("stepNameAr")} />
              {errors.stepNameAr ? <p className="text-xs text-brand-accent">{errors.stepNameAr.message}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="step-name-en" className="text-sm font-semibold text-brand-black">
                {t("stepNameEnLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input id="step-name-en" dir="ltr" disabled={isPending} placeholder={t("stepNameEnPlaceholder")} aria-invalid={Boolean(errors.stepNameEn)} className={FIELD_CLASS} {...register("stepNameEn")} />
              {errors.stepNameEn ? <p className="text-xs text-brand-accent">{errors.stepNameEn.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="step-title-ar" className="text-sm font-semibold text-brand-black">
                {t("titleArLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input id="step-title-ar" dir="rtl" disabled={isPending} placeholder={t("titleArPlaceholder")} aria-invalid={Boolean(errors.titleAr)} className={FIELD_CLASS} {...register("titleAr")} />
              {errors.titleAr ? <p className="text-xs text-brand-accent">{errors.titleAr.message}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="step-title-en" className="text-sm font-semibold text-brand-black">
                {t("titleEnLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input id="step-title-en" dir="ltr" disabled={isPending} placeholder={t("titleEnPlaceholder")} aria-invalid={Boolean(errors.titleEn)} className={FIELD_CLASS} {...register("titleEn")} />
              {errors.titleEn ? <p className="text-xs text-brand-accent">{errors.titleEn.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="step-description-ar" className="text-sm font-semibold text-brand-black">
                {t("descriptionArLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input id="step-description-ar" dir="rtl" disabled={isPending} placeholder={t("descriptionArPlaceholder")} aria-invalid={Boolean(errors.descriptionAr)} className={FIELD_CLASS} {...register("descriptionAr")} />
              {errors.descriptionAr ? <p className="text-xs text-brand-accent">{errors.descriptionAr.message}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="step-description-en" className="text-sm font-semibold text-brand-black">
                {t("descriptionEnLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input id="step-description-en" dir="ltr" disabled={isPending} placeholder={t("descriptionEnPlaceholder")} aria-invalid={Boolean(errors.descriptionEn)} className={FIELD_CLASS} {...register("descriptionEn")} />
              {errors.descriptionEn ? <p className="text-xs text-brand-accent">{errors.descriptionEn.message}</p> : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-brand-black">{t("imageLabel")}</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="sr-only"
              disabled={isPending}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleSelectImage(file);
                event.target.value = "";
              }}
            />
            <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-black/10 bg-[#FBFBFB] p-4">
              {previewUrl && !imageLoadFailed ? (
                <>
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={previewUrl}
                      src={previewUrl}
                      alt={t("imagePreviewAlt")}
                      className="mx-auto max-h-40 w-full object-contain"
                      onError={() => setImageLoadFailed(true)}
                      onLoad={() => setImageLoadFailed(false)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      aria-label={t("removeImage")}
                      onClick={handleRemoveImage}
                      className="absolute inset-e-2 top-2 size-8 rounded-full bg-brand-white/90 text-brand-gris hover:bg-brand-white hover:text-brand-black"
                    >
                      <X className="size-4" strokeWidth={2} />
                    </Button>
                  </div>
                  {imageFile ? (
                    <p title={imageFile.name} className="truncate text-xs text-brand-gris">{imageFile.name}</p>
                  ) : null}
                  <Button type="button" variant="outline" disabled={isPending} onClick={() => fileInputRef.current?.click()} className="h-10 rounded-full border-black/10 text-brand-black">
                    {t("changeImage")}
                  </Button>
                </>
              ) : (
                <button type="button" disabled={isPending} onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 py-4 text-center disabled:opacity-50">
                  <CustomIcon src="/svg/upload.svg" size={24} className="text-brand-primary" />
                  <span className="text-sm font-medium text-brand-black">{imageLoadFailed ? t("imageLoadError") : t("imageUploadTitle")}</span>
                  <span className="text-xs text-brand-gris">{t("imageUploadHint")}</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex min-w-0 shrink-0 flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "group relative h-10 min-h-10 w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border-none bg-brand-dark-blue px-4 text-sm font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-dark-blue/90 hover:shadow-md active:scale-[0.98] sm:h-12 sm:min-h-12 sm:w-auto sm:flex-[1.3] sm:px-5 sm:text-base",
              )}
            >
              {isPending ? (
                <Spinner className="size-4 text-brand-white sm:size-5" />
              ) : (
                <>
                  <span className="confirm-chevron-start inline-flex items-center" aria-hidden>
                    <ChevronsLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 sm:size-4 ltr:rotate-180" strokeWidth={2.25} />
                  </span>
                  <CustomIcon src="/svg/tick-square.svg" size={16} className="text-brand-white" />
                  <span className="tracking-wide">{isEdit ? t("save") : t("create")}</span>
                  <span className="confirm-chevron-end inline-flex items-center" aria-hidden>
                    <ChevronsRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:size-4 ltr:rotate-180" strokeWidth={2.25} />
                  </span>
                </>
              )}
            </Button>
            <Button type="button" variant="ghost" disabled={isPending} onClick={() => handleOpenChange(false)} className="h-10 min-h-10 w-full shrink-0 rounded-full bg-[#F5F5F5] px-3 text-sm font-semibold text-brand-black hover:bg-[#EBEBEB] sm:h-12 sm:min-h-12 sm:w-auto sm:flex-1 sm:px-5 sm:text-base">
              <span className="truncate">{t("cancel")}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
