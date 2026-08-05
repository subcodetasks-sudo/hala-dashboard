"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useSupportCards } from "@/features/content-management/queries/use-support-cards";
import { useUpsertSupportCard } from "@/features/content-management/queries/use-upsert-support-card";
import {
  createSupportCardFormSchema,
  emptySupportCardFormValues,
} from "@/features/content-management/schemas/support-card-form-schema";
import type {
  SupportCardFormValues,
  SupportCardRow,
} from "@/features/content-management/types";
import { resolveMediaUrl } from "@/lib/resolve-media-url";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const TEXTAREA_CLASS =
  "min-h-20 rounded-2xl border-black/10 bg-[#FBFBFB] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gris/60";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function revokeIfBlob(url: string | undefined) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function SupportCardEditor({ item }: { item: SupportCardRow }) {
  const t = useTranslations("ContentManagement.support.cards");
  const upsertCard = useUpsertSupportCard();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | undefined>();
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | undefined>();
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>();
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const previewUrl = localPreviewUrl ?? existingImageUrl;
  const isPhone = item.buttonType === "phone";

  const schema = useMemo(
    () =>
      createSupportCardFormSchema({
        titleArRequired: t("validation.titleArRequired"),
        titleEnRequired: t("validation.titleEnRequired"),
        descriptionArRequired: t("validation.descriptionArRequired"),
        descriptionEnRequired: t("validation.descriptionEnRequired"),
        buttonValueRequired: t("validation.buttonValueRequired"),
        buttonLabelArRequired: t("validation.buttonLabelArRequired"),
        buttonLabelEnRequired: t("validation.buttonLabelEnRequired"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportCardFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptySupportCardFormValues(item.buttonType),
  });

  useEffect(() => {
    reset({
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      descriptionAr: item.descriptionAr,
      descriptionEn: item.descriptionEn,
      buttonType: item.buttonType,
      buttonValue: item.buttonValue,
      buttonLabelAr: item.buttonLabelAr,
      buttonLabelEn: item.buttonLabelEn,
    });
    setImageFile(undefined);
    setLocalPreviewUrl((prev) => {
      revokeIfBlob(prev);
      return undefined;
    });
    setExistingImageUrl(resolveMediaUrl(item.image));
    setImageLoadFailed(false);
  }, [item, reset]);

  useEffect(() => {
    return () => {
      revokeIfBlob(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const isPending = upsertCard.isPending;

  const handleSelectImage = (file: File) => {
    setImageFile(file);
    setImageLoadFailed(false);
    setLocalPreviewUrl((prev) => {
      revokeIfBlob(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleRemoveImage = () => {
    setImageFile(undefined);
    setImageLoadFailed(false);
    setLocalPreviewUrl((prev) => {
      revokeIfBlob(prev);
      return undefined;
    });
    setExistingImageUrl(undefined);
  };

  const onSubmit = handleSubmit((values) => {
    upsertCard.mutate(
      {
        cardNumber: item.cardNumber,
        values: { ...values, buttonType: item.buttonType },
        image: imageFile,
      },
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

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col gap-5 rounded-[1.75rem] border border-black/5 bg-brand-white p-5 sm:p-6",
        isPhone ? "bg-brand-background/40" : "bg-brand-light-yellow/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-2xl",
              isPhone ? "bg-brand-primary/15" : "bg-brand-light-yellow",
            )}
          >
            <CustomIcon
              src={isPhone ? "/svg/phone.svg" : "/svg/directbox-notif.svg"}
              size={22}
              className="text-brand-dark-blue"
            />
          </span>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-bold text-brand-dark-blue">
              {isPhone ? t("phoneTitle") : t("emailTitle")}
            </h3>
            <p className="text-xs text-brand-gris">
              {t("cardNumber", { number: item.cardNumber })}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-brand-white/80 px-3 py-1 text-xs font-semibold text-brand-black">
          {isPhone ? t("buttonTypePhone") : t("buttonTypeEmail")}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-brand-black">
          {t("imageLabel")}
        </Label>
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
        <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-black/10 bg-brand-white p-4">
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
                <p
                  title={imageFile.name}
                  className="truncate text-xs text-brand-gris"
                >
                  {imageFile.name}
                </p>
              ) : null}
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => fileInputRef.current?.click()}
                className="h-10 rounded-full border-black/10 text-brand-black"
              >
                {t("changeImage")}
              </Button>
            </>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 py-5 text-center disabled:opacity-50"
            >
              <CustomIcon
                src="/svg/upload.svg"
                size={26}
                className="text-brand-primary"
              />
              <span className="text-sm font-medium text-brand-black">
                {imageLoadFailed ? t("imageLoadError") : t("imageUploadTitle")}
              </span>
              <span className="text-xs text-brand-gris">
                {t("imageUploadHint")}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <Field
          id={`card-${item.cardNumber}-titleAr`}
          label={t("titleArLabel")}
          error={errors.titleAr?.message}
        >
          <Input
            id={`card-${item.cardNumber}-titleAr`}
            dir="rtl"
            className={FIELD_CLASS}
            placeholder={t("titleArPlaceholder")}
            disabled={isPending}
            {...register("titleAr")}
          />
        </Field>
        <Field
          id={`card-${item.cardNumber}-titleEn`}
          label={t("titleEnLabel")}
          error={errors.titleEn?.message}
        >
          <Input
            id={`card-${item.cardNumber}-titleEn`}
            dir="ltr"
            className={FIELD_CLASS}
            placeholder={t("titleEnPlaceholder")}
            disabled={isPending}
            {...register("titleEn")}
          />
        </Field>
        <Field
          id={`card-${item.cardNumber}-descriptionAr`}
          label={t("descriptionArLabel")}
          error={errors.descriptionAr?.message}
        >
          <Textarea
            id={`card-${item.cardNumber}-descriptionAr`}
            dir="rtl"
            className={TEXTAREA_CLASS}
            placeholder={t("descriptionArPlaceholder")}
            disabled={isPending}
            {...register("descriptionAr")}
          />
        </Field>
        <Field
          id={`card-${item.cardNumber}-descriptionEn`}
          label={t("descriptionEnLabel")}
          error={errors.descriptionEn?.message}
        >
          <Textarea
            id={`card-${item.cardNumber}-descriptionEn`}
            dir="ltr"
            className={TEXTAREA_CLASS}
            placeholder={t("descriptionEnPlaceholder")}
            disabled={isPending}
            {...register("descriptionEn")}
          />
        </Field>
        <Field
          id={`card-${item.cardNumber}-buttonValue`}
          label={isPhone ? t("phoneValueLabel") : t("emailValueLabel")}
          error={errors.buttonValue?.message}
        >
          <Input
            id={`card-${item.cardNumber}-buttonValue`}
            dir="ltr"
            className={FIELD_CLASS}
            placeholder={
              isPhone ? t("phoneValuePlaceholder") : t("emailValuePlaceholder")
            }
            disabled={isPending}
            {...register("buttonValue")}
          />
        </Field>
        <Field
          id={`card-${item.cardNumber}-buttonLabelAr`}
          label={t("buttonLabelArLabel")}
          error={errors.buttonLabelAr?.message}
        >
          <Input
            id={`card-${item.cardNumber}-buttonLabelAr`}
            dir="rtl"
            className={FIELD_CLASS}
            placeholder={t("buttonLabelArPlaceholder")}
            disabled={isPending}
            {...register("buttonLabelAr")}
          />
        </Field>
        <Field
          id={`card-${item.cardNumber}-buttonLabelEn`}
          label={t("buttonLabelEnLabel")}
          error={errors.buttonLabelEn?.message}
        >
          <Input
            id={`card-${item.cardNumber}-buttonLabelEn`}
            dir="ltr"
            className={FIELD_CLASS}
            placeholder={t("buttonLabelEnPlaceholder")}
            disabled={isPending}
            {...register("buttonLabelEn")}
          />
        </Field>
      </div>

      <div className="flex justify-end pt-1">
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

export default function SupportCardsSection() {
  const t = useTranslations("ContentManagement.support.cards");
  const { data, isLoading, isError, error, refetch } = useSupportCards();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2" aria-busy="true">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-[1.75rem] border border-black/5 bg-brand-white p-5"
          >
            <Skeleton className="h-11 w-40 rounded-2xl bg-brand-primary/15" />
            <Skeleton className="h-40 w-full rounded-3xl bg-brand-gris/10" />
            {Array.from({ length: 4 }).map((__, fieldIndex) => (
              <Skeleton
                key={fieldIndex}
                className="h-11 w-full rounded-full bg-brand-gris/10"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
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
    );
  }

  const [phoneCard, emailCard] = data ?? [];

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {phoneCard ? <SupportCardEditor item={phoneCard} /> : null}
      {emailCard ? <SupportCardEditor item={emailCard} /> : null}
    </section>
  );
}
