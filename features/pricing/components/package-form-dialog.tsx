"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, ChevronsRight, Plus, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePackage } from "@/features/pricing/queries/use-create-package";
import { useUpdatePackage } from "@/features/pricing/queries/use-update-package";
import {
  createPackageFormSchema,
  EMPTY_PACKAGE_FORM_VALUES,
} from "@/features/pricing/schemas/package-form-schema";
import type { PackageFormValues, PackageRow } from "@/features/pricing/types";
import { resolveMediaUrl } from "@/lib/resolve-media-url";
import { cn } from "@/lib/utils";

type PackageFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: PackageRow | null;
};

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const TEXTAREA_CLASS =
  "min-h-24 rounded-2xl border-black/10 bg-[#FBFBFB] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gris/60";

const SELECT_TRIGGER_CLASS =
  "h-11 w-full rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";

function revokeIfBlob(url: string | undefined) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export default function PackageFormDialog({
  open,
  onOpenChange,
  item = null,
}: PackageFormDialogProps) {
  const t = useTranslations("Pricing.packages.formDialog");
  const locale = useLocale();
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const isEdit = Boolean(item);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [iconFile, setIconFile] = useState<File | undefined>();
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | undefined>();
  const [existingIconUrl, setExistingIconUrl] = useState<string | undefined>();
  const [iconLoadFailed, setIconLoadFailed] = useState(false);

  const previewUrl = localPreviewUrl ?? existingIconUrl;

  const schema = useMemo(
    () =>
      createPackageFormSchema({
        titleArRequired: t("validation.titleArRequired"),
        titleEnRequired: t("validation.titleEnRequired"),
        descriptionArRequired: t("validation.descriptionArRequired"),
        descriptionEnRequired: t("validation.descriptionEnRequired"),
        priceRequired: t("validation.priceRequired"),
        priceInvalid: t("validation.priceInvalid"),
        typeRequired: t("validation.typeRequired"),
        sortOrderRequired: t("validation.sortOrderRequired"),
        sortOrderInvalid: t("validation.sortOrderInvalid"),
        advantagesRequired: t("validation.advantagesRequired"),
        advantageTextArRequired: t("validation.advantageTextArRequired"),
        advantageTextEnRequired: t("validation.advantageTextEnRequired"),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_PACKAGE_FORM_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "advantages",
  });

  const isPending = createPackage.isPending || updatePackage.isPending;

  useEffect(() => {
    if (!open) return;

    reset(
      item
        ? {
            titleAr: item.titleAr,
            titleEn: item.titleEn,
            descriptionAr: item.descriptionAr,
            descriptionEn: item.descriptionEn,
            price: String(item.price),
            type:
              item.type === "whatsapp" ? "whatsapp" : "plan_renewal",
            sortOrder: String(item.sortOrder),
            advantages:
              item.advantages.length > 0
                ? item.advantages
                : [{ textAr: "", textEn: "" }],
          }
        : EMPTY_PACKAGE_FORM_VALUES,
    );
    setIconFile(undefined);
    setLocalPreviewUrl(undefined);
    setExistingIconUrl(resolveMediaUrl(item?.icon));
    setIconLoadFailed(false);
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
    setIconFile(undefined);
  };

  const handleSelectIcon = (file: File) => {
    clearLocalPreview();
    setIconFile(file);
    setLocalPreviewUrl(URL.createObjectURL(file));
    setIconLoadFailed(false);
  };

  const handleRemoveIcon = () => {
    clearLocalPreview();
    setExistingIconUrl(undefined);
    setIconLoadFailed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isPending) return;
      clearLocalPreview();
      reset(EMPTY_PACKAGE_FORM_VALUES);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = handleSubmit((values) => {
    if (isEdit && item) {
      updatePackage.mutate(
        { id: item.id, values, icon: iconFile },
        {
          onSuccess: (payload) => {
            toast.success(payload.message || t("toastUpdated"));
            clearLocalPreview();
            reset(EMPTY_PACKAGE_FORM_VALUES);
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

    createPackage.mutate(
      { values, icon: iconFile },
      {
        onSuccess: (payload) => {
          toast.success(payload.message || t("toastCreated"));
          clearLocalPreview();
          reset(EMPTY_PACKAGE_FORM_VALUES);
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
        className="no-scrollbar w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-xl border-none bg-white p-0 ring-0 sm:max-w-2xl max-h-[90vh]"
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
              <Label htmlFor="plan-title-ar" className="text-sm font-semibold text-brand-black">
                {t("titleArLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input id="plan-title-ar" dir="rtl" disabled={isPending} placeholder={t("titleArPlaceholder")} aria-invalid={Boolean(errors.titleAr)} className={FIELD_CLASS} {...register("titleAr")} />
              {errors.titleAr ? <p className="text-xs text-brand-accent">{errors.titleAr.message}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-title-en" className="text-sm font-semibold text-brand-black">
                {t("titleEnLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input id="plan-title-en" dir="ltr" disabled={isPending} placeholder={t("titleEnPlaceholder")} aria-invalid={Boolean(errors.titleEn)} className={FIELD_CLASS} {...register("titleEn")} />
              {errors.titleEn ? <p className="text-xs text-brand-accent">{errors.titleEn.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-description-ar" className="text-sm font-semibold text-brand-black">
                {t("descriptionArLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Textarea id="plan-description-ar" dir="rtl" disabled={isPending} placeholder={t("descriptionArPlaceholder")} aria-invalid={Boolean(errors.descriptionAr)} className={TEXTAREA_CLASS} {...register("descriptionAr")} />
              {errors.descriptionAr ? <p className="text-xs text-brand-accent">{errors.descriptionAr.message}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-description-en" className="text-sm font-semibold text-brand-black">
                {t("descriptionEnLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Textarea id="plan-description-en" dir="ltr" disabled={isPending} placeholder={t("descriptionEnPlaceholder")} aria-invalid={Boolean(errors.descriptionEn)} className={TEXTAREA_CLASS} {...register("descriptionEn")} />
              {errors.descriptionEn ? <p className="text-xs text-brand-accent">{errors.descriptionEn.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-price" className="text-sm font-semibold text-brand-black">
                {t("priceLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input id="plan-price" inputMode="decimal" disabled={isPending} placeholder={t("pricePlaceholder")} aria-invalid={Boolean(errors.price)} className={FIELD_CLASS} {...register("price")} />
              {errors.price ? <p className="text-xs text-brand-accent">{errors.price.message}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-sort-order" className="text-sm font-semibold text-brand-black">
                {t("sortOrderLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input id="plan-sort-order" inputMode="numeric" disabled={isPending} placeholder={t("sortOrderPlaceholder")} aria-invalid={Boolean(errors.sortOrder)} className={FIELD_CLASS} {...register("sortOrder")} />
              {errors.sortOrder ? <p className="text-xs text-brand-accent">{errors.sortOrder.message}</p> : null}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-brand-black">
              {t("typeLabel")} <span className="text-brand-accent" aria-hidden>*</span>
            </Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  dir={locale === "en" ? "ltr" : "rtl"}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger className={SELECT_TRIGGER_CLASS} aria-invalid={Boolean(errors.type)}>
                    <SelectValue placeholder={t("typePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-brand-primary/20">
                    <SelectItem value="plan_renewal">{t("type.plan_renewal")}</SelectItem>
                    <SelectItem value="whatsapp">{t("type.whatsapp")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type ? <p className="text-xs text-brand-accent">{errors.type.message}</p> : null}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-sm font-semibold text-brand-black">
                {t("advantagesLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => append({ textAr: "", textEn: "" })}
                className="h-9 gap-1.5 rounded-full border-black/10 px-3 text-xs font-semibold text-brand-black"
              >
                <Plus className="size-3.5" strokeWidth={2} />
                {t("addAdvantage")}
              </Button>
            </div>

            {errors.advantages && !Array.isArray(errors.advantages) ? (
              <p className="text-xs text-brand-accent">{errors.advantages.message}</p>
            ) : null}

            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-[#FBFBFB] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-brand-gris">
                      {t("advantageItem", { index: index + 1 })}
                    </span>
                    {fields.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        aria-label={t("removeAdvantage")}
                        onClick={() => remove(index)}
                        className="size-8 rounded-full text-brand-accent hover:bg-brand-accent/10 hover:text-brand-accent"
                      >
                        <Trash2 className="size-4" strokeWidth={2} />
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-medium text-brand-black">
                        {t("advantageTextArLabel")}
                      </Label>
                      <Input
                        dir="rtl"
                        disabled={isPending}
                        placeholder={t("advantageTextArPlaceholder")}
                        aria-invalid={Boolean(errors.advantages?.[index]?.textAr)}
                        className={FIELD_CLASS}
                        {...register(`advantages.${index}.textAr`)}
                      />
                      {errors.advantages?.[index]?.textAr ? (
                        <p className="text-xs text-brand-accent">
                          {errors.advantages[index]?.textAr?.message}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-medium text-brand-black">
                        {t("advantageTextEnLabel")}
                      </Label>
                      <Input
                        dir="ltr"
                        disabled={isPending}
                        placeholder={t("advantageTextEnPlaceholder")}
                        aria-invalid={Boolean(errors.advantages?.[index]?.textEn)}
                        className={FIELD_CLASS}
                        {...register(`advantages.${index}.textEn`)}
                      />
                      {errors.advantages?.[index]?.textEn ? (
                        <p className="text-xs text-brand-accent">
                          {errors.advantages[index]?.textEn?.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-brand-black">{t("iconLabel")}</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="sr-only"
              disabled={isPending}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleSelectIcon(file);
                event.target.value = "";
              }}
            />
            <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-black/10 bg-[#FBFBFB] p-4">
              {previewUrl && !iconLoadFailed ? (
                <>
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={previewUrl}
                      src={previewUrl}
                      alt={t("iconPreviewAlt")}
                      className="mx-auto max-h-40 w-full object-contain"
                      onError={() => setIconLoadFailed(true)}
                      onLoad={() => setIconLoadFailed(false)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      aria-label={t("removeIcon")}
                      onClick={handleRemoveIcon}
                      className="absolute inset-e-2 top-2 size-8 rounded-full bg-brand-white/90 text-brand-gris hover:bg-brand-white hover:text-brand-black"
                    >
                      <X className="size-4" strokeWidth={2} />
                    </Button>
                  </div>
                  {iconFile ? (
                    <p title={iconFile.name} className="truncate text-xs text-brand-gris">
                      {iconFile.name}
                    </p>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 rounded-full border-black/10 text-brand-black"
                  >
                    {t("changeIcon")}
                  </Button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 py-4 text-center disabled:opacity-50"
                >
                  <CustomIcon src="/svg/upload.svg" size={24} className="text-brand-primary" />
                  <span className="text-sm font-medium text-brand-black">
                    {iconLoadFailed ? t("iconLoadError") : t("iconUploadTitle")}
                  </span>
                  <span className="text-xs text-brand-gris">{t("iconUploadHint")}</span>
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

            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
              className="h-10 min-h-10 w-full shrink-0 rounded-full bg-[#F5F5F5] px-3 text-sm font-semibold text-brand-black hover:bg-[#EBEBEB] sm:h-12 sm:min-h-12 sm:w-auto sm:flex-1 sm:px-5 sm:text-base"
            >
              <span className="truncate">{t("cancel")}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
