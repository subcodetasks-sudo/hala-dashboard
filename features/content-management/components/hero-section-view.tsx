"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useHero } from "@/features/content-management/queries/use-hero";
import { useUpsertHero } from "@/features/content-management/queries/use-upsert-hero";
import {
  createHeroFormSchema,
  EMPTY_HERO_FORM_VALUES,
} from "@/features/content-management/schemas/hero-form-schema";
import type {
  HeroApiItem,
  HeroFormValues,
} from "@/features/content-management/types";
import { useRouter } from "@/i18n/navigation";
import { resolveMediaUrl } from "@/lib/resolve-media-url";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

/** Accepted hero image MIME types. */
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function toEditorContent(value: string | undefined | null): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;
  return `<p>${trimmed}</p>`;
}

function toFormValues(hero: HeroApiItem | null | undefined): HeroFormValues {
  if (!hero) return EMPTY_HERO_FORM_VALUES;

  return {
    badgeAr: hero.badge?.ar ?? "",
    badgeEn: hero.badge?.en ?? "",
    titleAr: toEditorContent(hero.title?.ar),
    titleEn: toEditorContent(hero.title?.en),
    descriptionAr: toEditorContent(hero.description?.ar),
    descriptionEn: toEditorContent(hero.description?.en),
  };
}

function revokeIfBlob(url: string | undefined) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export default function HeroSectionView() {
  const t = useTranslations("ContentManagement.hero");
  const locale = useLocale();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: hero, isLoading, isError, error, refetch } = useHero();
  const upsertHero = useUpsertHero();

  const [imageFile, setImageFile] = useState<File | undefined>();
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | undefined>();
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>();
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const previewUrl = localPreviewUrl ?? existingImageUrl;
  const heroImageKey = hero?.image ?? null;

  const formValues = useMemo(() => toFormValues(hero), [hero]);

  const schema = useMemo(
    () =>
      createHeroFormSchema({
        badgeArRequired: t("validation.badgeArRequired"),
        badgeEnRequired: t("validation.badgeEnRequired"),
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
  } = useForm<HeroFormValues>({
    resolver: zodResolver(schema),
    // Keep editors in sync with fetched hero data (avoids empty TipTap race).
    values: formValues,
  });

  useEffect(() => {
    if (isLoading) return;
    if (imageFile) return;

    setExistingImageUrl(resolveMediaUrl(heroImageKey));
    setImageLoadFailed(false);
  }, [heroImageKey, imageFile, isLoading]);

  useEffect(() => {
    return () => {
      revokeIfBlob(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const isPending = upsertHero.isPending;

  const handleBack = () => {
    router.push("/content-management");
  };

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

  const onSubmit = handleSubmit((values) => {
    upsertHero.mutate(
      { values, image: imageFile },
      {
        onSuccess: (payload) => {
          toast.success(payload.message || t("toastSaved"));
          clearLocalPreview();
          const nextUrl = resolveMediaUrl(payload.data?.image);
          setExistingImageUrl(nextUrl);
          setImageLoadFailed(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
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
    return <HeroSectionSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-w-0 flex-col gap-6 p-4 pb-8">
        <header className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("back")}
            onClick={handleBack}
            className="size-9 shrink-0 rounded-full bg-brand-gris/10 text-brand-gris hover:bg-brand-gris/15 hover:text-brand-black"
          >
            {locale === "en" ? (
              <ArrowLeft className="size-4" strokeWidth={2} />
            ) : (
              <ArrowRight className="size-4" strokeWidth={2} />
            )}
          </Button>
          <h1 className="text-2xl font-bold text-brand-dark-blue">
            {t("title")}
          </h1>
        </header>

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
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 pb-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("back")}
            onClick={handleBack}
            className="size-9 shrink-0 rounded-full bg-brand-gris/10 text-brand-gris hover:bg-brand-gris/15 hover:text-brand-black"
          >
            {locale === "en" ? (
              <ArrowLeft className="size-4" strokeWidth={2} />
            ) : (
              <ArrowRight className="size-4" strokeWidth={2} />
            )}
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-brand-dark-blue">
              {t("title")}
            </h1>
            <p className="text-sm text-brand-gris">{t("description")}</p>
          </div>
        </div>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-6 rounded-[1.75rem] border border-black/5 bg-brand-white p-5 sm:p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="badgeAr"
            label={t("badgeArLabel")}
            error={errors.badgeAr?.message}
          >
            <Input
              id="badgeAr"
              dir="rtl"
              className={FIELD_CLASS}
              placeholder={t("badgeArPlaceholder")}
              disabled={isPending}
              {...register("badgeAr")}
            />
          </Field>
          <Field
            id="badgeEn"
            label={t("badgeEnLabel")}
            error={errors.badgeEn?.message}
          >
            <Input
              id="badgeEn"
              dir="ltr"
              className={FIELD_CLASS}
              placeholder={t("badgeEnPlaceholder")}
              disabled={isPending}
              {...register("badgeEn")}
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
            <Controller
              control={control}
              name="descriptionAr"
              render={({ field }) => (
                <RichTextEditor
                  id="descriptionAr"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("descriptionArPlaceholder")}
                  disabled={isPending}
                  invalid={Boolean(errors.descriptionAr)}
                  minHeightClassName="min-h-48"
                />
              )}
            />
          </Field>
          <Field
            id="descriptionEn"
            label={t("descriptionEnLabel")}
            error={errors.descriptionEn?.message}
          >
            <Controller
              control={control}
              name="descriptionEn"
              render={({ field }) => (
                <RichTextEditor
                  id="descriptionEn"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("descriptionEnPlaceholder")}
                  disabled={isPending}
                  invalid={Boolean(errors.descriptionEn)}
                  minHeightClassName="min-h-48"
                />
              )}
            />
          </Field>
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
          <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-black/10 bg-[#FBFBFB] p-4">
            {previewUrl && !imageLoadFailed ? (
              <>
                <div className="relative overflow-hidden rounded-2xl ">
                  {/* Remote API / blob URLs; plain img keeps preview reliable. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={previewUrl}
                    src={previewUrl}
                    alt={t("imagePreviewAlt")}
                    className="mx-auto max-h-64 w-full object-contain"
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
                className="flex flex-col items-center gap-2 py-6 text-center disabled:opacity-50"
              >
                <CustomIcon
                  src="/svg/upload.svg"
                  size={28}
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

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleBack}
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

function HeroSectionSkeleton() {
  return (
    <div
      className="flex min-w-0 flex-col gap-6 p-4 pb-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full bg-brand-gris/15" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48 bg-brand-primary/15" />
          <Skeleton className="h-4 w-72 bg-brand-gris/15" />
        </div>
      </div>
      <div className="flex flex-col gap-5 rounded-[1.75rem] border border-black/5 bg-brand-white p-5 sm:p-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full rounded-full bg-brand-gris/10" />
            <Skeleton className="h-11 w-full rounded-full bg-brand-gris/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
