"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { RichTextEditor } from "@/components/rich-text-editor";
import { useAddBlog } from "@/features/content-management/queries/use-add-blog";
import { createAddBlogSchema } from "@/features/content-management/schemas/add-blog-schema";
import type { AddBlogFormValues } from "@/features/content-management/types";
import { cn } from "@/lib/utils";

type AddBlogDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const SELECT_TRIGGER_CLASS =
  "h-11! w-full rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm font-medium text-brand-black [&_svg]:text-brand-accent";

function RequiredLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: string;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-sm font-semibold text-brand-black"
    >
      {children}{" "}
      <span className="text-brand-accent" aria-hidden>
        *
      </span>
    </Label>
  );
}

export default function AddBlogDialog({
  open,
  onOpenChange,
}: AddBlogDialogProps) {
  const t = useTranslations("ContentManagement.addBlogDialog");
  const tContent = useTranslations("ContentManagement");
  const locale = useLocale();
  const addBlog = useAddBlog();
  const defaultAuthor = tContent("author.systemAdmin");

  const schema = useMemo(
    () =>
      createAddBlogSchema({
        titleRequired: t("validation.titleRequired"),
        summaryRequired: t("validation.summaryRequired"),
        keywordsRequired: t("validation.keywordsRequired"),
        categoryRequired: t("validation.categoryRequired"),
        statusRequired: t("validation.statusRequired"),
        authorRequired: t("validation.authorRequired"),
        readingTimeRequired: t("validation.readingTimeRequired"),
        contentRequired: t("validation.contentRequired"),
      }),
    [t]
  );

  const defaultValues = useMemo<AddBlogFormValues>(
    () => ({
      title: "",
      summary: "",
      keywords: "",
      category: "blog",
      status: "published",
      author: defaultAuthor,
      readingTime: "5",
      content: "",
    }),
    [defaultAuthor]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddBlogFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const isPending = addBlog.isPending;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isPending) return;
      reset(defaultValues);
    }
    onOpenChange(nextOpen);
  };

  const submitWithStatus = (status: AddBlogFormValues["status"]) =>
    handleSubmit((values) => {
      addBlog.mutate(
        { ...values, status },
        {
          onSuccess: () => {
            toast.success(
              status === "published" ? t("toastPublished") : t("toastDraft")
            );
            handleOpenChange(false);
          },
          onError: (error) => {
            toast.error(
              error instanceof Error && error.message
                ? error.message
                : t("errorToast")
            );
          },
        }
      );
    })();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar flex max-h-[90vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-xl border-none bg-white p-0 ring-0 sm:max-w-5xl"
      >
        <div className="flex min-w-0 shrink-0 items-center justify-between gap-3  px-5 py-4">
          <DialogTitle className="min-w-0 truncate text-base font-bold text-brand-black">
            {t("title")}
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
        <div className="border-b border-black/10 w-95/100 mx-auto"></div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            submitWithStatus("published");
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {/* RTL: first column (fields) renders on the right. */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <RequiredLabel htmlFor="blog-title">
                    {t("titleLabel")}
                  </RequiredLabel>
                  <Input
                    id="blog-title"
                    disabled={isPending}
                    placeholder={t("titlePlaceholder")}
                    aria-invalid={Boolean(errors.title)}
                    className={FIELD_CLASS}
                    {...register("title")}
                  />
                  {errors.title ? (
                    <p className="text-xs text-brand-accent">
                      {errors.title.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1.5">
                  <RequiredLabel htmlFor="blog-summary">
                    {t("summaryLabel")}
                  </RequiredLabel>
                  <Textarea
                    id="blog-summary"
                    disabled={isPending}
                    placeholder={t("summaryPlaceholder")}
                    aria-invalid={Boolean(errors.summary)}
                    className="min-h-24 rounded-3xl border-black/10 bg-[#FBFBFB] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gris/60"
                    {...register("summary")}
                  />
                  {errors.summary ? (
                    <p className="text-xs text-brand-accent">
                      {errors.summary.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1.5">
                  <RequiredLabel htmlFor="blog-keywords">
                    {t("keywordsLabel")}
                  </RequiredLabel>
                  <Input
                    id="blog-keywords"
                    disabled={isPending}
                    placeholder={t("keywordsPlaceholder")}
                    aria-invalid={Boolean(errors.keywords)}
                    className={FIELD_CLASS}
                    {...register("keywords")}
                  />
                  {errors.keywords ? (
                    <p className="text-xs text-brand-accent">
                      {errors.keywords.message}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <RequiredLabel>{t("categoryLabel")}</RequiredLabel>
                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <Select
                          dir={locale === "en" ? "ltr" : "rtl"}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}
                        >
                          <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-brand-primary/20">
                            <SelectItem value="blog">
                              {t("category.blog")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <RequiredLabel>{t("statusLabel")}</RequiredLabel>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          dir={locale === "en" ? "ltr" : "rtl"}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}
                        >
                          <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-brand-primary/20">
                            <SelectItem value="published">
                              {t("status.published")}
                            </SelectItem>
                            <SelectItem value="draft">
                              {t("status.draft")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <RequiredLabel htmlFor="blog-author">
                      {t("authorLabel")}
                    </RequiredLabel>
                    <Input
                      id="blog-author"
                      readOnly
                      disabled={isPending}
                      aria-invalid={Boolean(errors.author)}
                      className={cn(FIELD_CLASS, "read-only:bg-[#FBFBFB]")}
                      {...register("author")}
                    />
                    {errors.author ? (
                      <p className="text-xs text-brand-accent">
                        {errors.author.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <RequiredLabel htmlFor="blog-reading-time">
                      {t("readingTimeLabel")}
                    </RequiredLabel>
                    <Input
                      id="blog-reading-time"
                      type="number"
                      min={1}
                      disabled={isPending}
                      aria-invalid={Boolean(errors.readingTime)}
                      className={FIELD_CLASS}
                      {...register("readingTime")}
                    />
                    {errors.readingTime ? (
                      <p className="text-xs text-brand-accent">
                        {errors.readingTime.message}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <RequiredLabel htmlFor="blog-content">
                  {t("contentLabel")}
                </RequiredLabel>
                <Controller
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <RichTextEditor
                      id="blog-content"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t("contentPlaceholder")}
                      disabled={isPending}
                      invalid={Boolean(errors.content)}
                    />
                  )}
                />
                {errors.content ? (
                  <p className="text-xs text-brand-accent">
                    {errors.content.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* RTL: first item renders on the right (Publish → Draft → Cancel). */}
          <div className="flex shrink-0 flex-col gap-2 border-t border-black/10 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-4">
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "group relative h-10 min-h-10 w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border-none bg-brand-dark-blue px-4 text-sm font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-dark-blue/90 hover:shadow-md active:scale-[0.98] sm:h-12 sm:min-h-12 sm:w-auto sm:flex-[1.6] sm:px-5 sm:text-base"
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
                    src="/svg/refresh-2.svg"
                    size={16}
                    className="text-brand-white"
                  />
                  <span className="tracking-wide">{t("publish")}</span>
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

            <div className="flex w-full shrink-0 gap-2 sm:contents">
              <Button
                type="button"
                disabled={isPending}
                onClick={() => submitWithStatus("draft")}
                className="h-10 min-h-10 min-w-0 flex-1 shrink-0 gap-2 rounded-full border-none bg-brand-accent px-3 text-sm font-semibold text-brand-white hover:bg-brand-accent/90 sm:h-12 sm:min-h-12 sm:w-auto sm:flex-1 sm:px-5 sm:text-base"
              >
                {isPending ? (
                  <Spinner className="size-4 text-brand-white sm:size-5" />
                ) : (
                  <>
                    <CustomIcon
                      src="/svg/document-text.svg"
                      size={16}
                      className="shrink-0 text-brand-white"
                    />
                    <span className="truncate">{t("saveDraft")}</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => handleOpenChange(false)}
                className="h-10 min-h-10 min-w-0 flex-1 shrink-0 rounded-full bg-[#F5F5F5] px-3 text-sm font-semibold text-brand-black hover:bg-[#EBEBEB] sm:h-12 sm:min-h-12 sm:w-auto sm:flex-1 sm:px-5 sm:text-base"
              >
                <span className="truncate">{t("cancel")}</span>
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
