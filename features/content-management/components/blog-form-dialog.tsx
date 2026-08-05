"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useCreateBlog } from "@/features/content-management/queries/use-create-blog";
import { useUpdateBlog } from "@/features/content-management/queries/use-update-blog";
import {
  createBlogFormSchema,
  EMPTY_BLOG_FORM_VALUES,
} from "@/features/content-management/schemas/blog-form-schema";
import type {
  BlogFormValues,
  BlogRow,
  BlogStatus,
} from "@/features/content-management/types";
import {
  slugifyFromEnglishTitle,
  toDatetimeLocalValue,
} from "@/features/content-management/utils/slugify";
import { resolveMediaUrl } from "@/lib/resolve-media-url";
import { cn } from "@/lib/utils";

type BlogFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: BlogRow | null;
};

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const SELECT_TRIGGER_CLASS =
  "h-11! w-full rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm font-medium text-brand-black [&_svg]:text-brand-accent";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function toEditorContent(value: string | undefined | null): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;
  return `<p>${trimmed}</p>`;
}

function toBlogStatus(value: string): BlogStatus {
  return value === "inactive" ? "inactive" : "active";
}

function revokeIfBlob(url: string | undefined) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export default function BlogFormDialog({
  open,
  onOpenChange,
  item = null,
}: BlogFormDialogProps) {
  const t = useTranslations("ContentManagement.blog.formDialog");
  const locale = useLocale();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const isEdit = Boolean(item);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | undefined>();
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | undefined>();
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>();
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const previewUrl = localPreviewUrl ?? existingImageUrl;

  const schema = useMemo(
    () =>
      createBlogFormSchema({
        titleArRequired: t("validation.titleArRequired"),
        titleEnRequired: t("validation.titleEnRequired"),
        contentArRequired: t("validation.contentArRequired"),
        contentEnRequired: t("validation.contentEnRequired"),
        slugRequired: t("validation.slugRequired"),
        statusRequired: t("validation.statusRequired"),
        publishedAtRequired: t("validation.publishedAtRequired"),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_BLOG_FORM_VALUES,
  });

  const titleEn = useWatch({ control, name: "titleEn" });
  const isPending = createBlog.isPending || updateBlog.isPending;

  useEffect(() => {
    if (!open) return;

    reset(
      item
        ? {
            titleAr: item.titleAr,
            titleEn: item.titleEn,
            contentAr: toEditorContent(item.contentAr),
            contentEn: toEditorContent(item.contentEn),
            slug: item.slug,
            status: toBlogStatus(item.status),
            publishedAt: toDatetimeLocalValue(item.publishedAt),
          }
        : EMPTY_BLOG_FORM_VALUES,
    );
    setImageFile(undefined);
    setLocalPreviewUrl(undefined);
    setExistingImageUrl(resolveMediaUrl(item?.image));
    setImageLoadFailed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, item, reset]);

  useEffect(() => {
    if (!open) return;
    setValue("slug", slugifyFromEnglishTitle(titleEn ?? ""), {
      shouldValidate: false,
    });
  }, [open, titleEn, setValue]);

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
      reset(EMPTY_BLOG_FORM_VALUES);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = handleSubmit((values) => {
    if (isEdit && item) {
      updateBlog.mutate(
        { id: item.id, values, image: imageFile },
        {
          onSuccess: (payload) => {
            toast.success(payload.message || t("toastUpdated"));
            clearLocalPreview();
            reset(EMPTY_BLOG_FORM_VALUES);
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

    createBlog.mutate(
      { values, image: imageFile },
      {
        onSuccess: (payload) => {
          toast.success(payload.message || t("toastCreated"));
          clearLocalPreview();
          reset(EMPTY_BLOG_FORM_VALUES);
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
                htmlFor="blog-title-ar"
                className="text-sm font-semibold text-brand-black"
              >
                {t("titleArLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id="blog-title-ar"
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
                htmlFor="blog-title-en"
                className="text-sm font-semibold text-brand-black"
              >
                {t("titleEnLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id="blog-title-en"
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
                htmlFor="blog-content-ar"
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
                    id="blog-content-ar"
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
                htmlFor="blog-content-en"
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
                    id="blog-content-en"
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

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="blog-slug"
                className="text-sm font-semibold text-brand-black"
              >
                {t("slugLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id="blog-slug"
                dir="ltr"
                disabled={isPending}
                placeholder={t("slugPlaceholder")}
                aria-invalid={Boolean(errors.slug)}
                className={FIELD_CLASS}
                {...register("slug")}
              />
              {errors.slug ? (
                <p className="text-xs text-brand-accent">{errors.slug.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-brand-black">
                {t("statusLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    dir={locale === "en" ? "ltr" : "rtl"}
                    value={field.value}
                    onValueChange={(value) =>
                      field.onChange(toBlogStatus(value ?? "active"))
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger
                      aria-invalid={Boolean(errors.status)}
                      className={SELECT_TRIGGER_CLASS}
                    >
                      <SelectValue placeholder={t("statusPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-brand-primary/20">
                      <SelectItem value="active">{t("status.active")}</SelectItem>
                      <SelectItem value="inactive">
                        {t("status.inactive")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status ? (
                <p className="text-xs text-brand-accent">
                  {errors.status.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="blog-published-at"
                className="text-sm font-semibold text-brand-black"
              >
                {t("publishedAtLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id="blog-published-at"
                type="datetime-local"
                disabled={isPending}
                aria-invalid={Boolean(errors.publishedAt)}
                className={FIELD_CLASS}
                {...register("publishedAt")}
              />
              {errors.publishedAt ? (
                <p className="text-xs text-brand-accent">
                  {errors.publishedAt.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-brand-black">
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
                  className="flex flex-col items-center gap-2 py-4 text-center disabled:opacity-50"
                >
                  <CustomIcon
                    src="/svg/upload.svg"
                    size={24}
                    className="text-brand-primary"
                  />
                  <span className="text-sm font-medium text-brand-black">
                    {imageLoadFailed
                      ? t("imageLoadError")
                      : t("imageUploadTitle")}
                  </span>
                  <span className="text-xs text-brand-gris">
                    {t("imageUploadHint")}
                  </span>
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
                  <span
                    className="confirm-chevron-start inline-flex items-center"
                    aria-hidden
                  >
                    <ChevronsLeft
                      className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 sm:size-4 ltr:rotate-180"
                      strokeWidth={2.25}
                    />
                  </span>
                  <CustomIcon
                    src="/svg/tick-square.svg"
                    size={16}
                    className="text-brand-white"
                  />
                  <span className="tracking-wide">
                    {isEdit ? t("save") : t("create")}
                  </span>
                  <span
                    className="confirm-chevron-end inline-flex items-center"
                    aria-hidden
                  >
                    <ChevronsRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:size-4 ltr:rotate-180"
                      strokeWidth={2.25}
                    />
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
