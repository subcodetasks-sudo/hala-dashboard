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
import BlogContentEditor from "@/features/content-management/components/blog-content-editor";
import { useAddLegal } from "@/features/content-management/queries/use-add-legal";
import { createAddLegalSchema } from "@/features/content-management/schemas/add-legal-schema";
import type { AddLegalFormValues } from "@/features/content-management/types";
import { cn } from "@/lib/utils";

type AddLegalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const SELECT_TRIGGER_CLASS =
  "h-11! w-full rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm font-medium text-brand-black [&_svg]:text-brand-accent";

export default function AddLegalDialog({
  open,
  onOpenChange,
}: AddLegalDialogProps) {
  const t = useTranslations("ContentManagement.addLegalDialog");
  const locale = useLocale();
  const addLegal = useAddLegal();

  const schema = useMemo(
    () =>
      createAddLegalSchema({
        pageNameRequired: t("validation.pageNameRequired"),
        statusRequired: t("validation.statusRequired"),
        contentRequired: t("validation.contentRequired"),
      }),
    [t]
  );

  const defaultValues = useMemo<AddLegalFormValues>(
    () => ({
      pageName: "",
      status: "published",
      content: "",
    }),
    []
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddLegalFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const isPending = addLegal.isPending;

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

  const submitWithStatus = (status: AddLegalFormValues["status"]) =>
    handleSubmit((values) => {
      addLegal.mutate(
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
        className="no-scrollbar flex max-h-[90vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-[1.75rem] border-none bg-white p-0 ring-0 sm:max-w-xl"
      >
        <div className="flex min-w-0 shrink-0 items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
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

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            submitWithStatus("published");
          }}
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="legal-page-name"
                className="text-sm font-semibold text-brand-black"
              >
                {t("pageNameLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id="legal-page-name"
                disabled={isPending}
                placeholder={t("pageNamePlaceholder")}
                aria-invalid={Boolean(errors.pageName)}
                className={FIELD_CLASS}
                {...register("pageName")}
              />
              {errors.pageName ? (
                <p className="text-xs text-brand-accent">
                  {errors.pageName.message}
                </p>
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
                      <SelectItem value="draft">{t("status.draft")}</SelectItem>
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
                htmlFor="legal-content"
                className="text-sm font-semibold text-brand-black"
              >
                {t("contentLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <BlogContentEditor
                    id="legal-content"
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

          {/* RTL: first item renders on the right (Publish → Draft → Cancel). */}
          <div className="flex shrink-0 flex-col gap-2 border-t border-black/10 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-4">
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "group relative h-10 min-h-10 w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border-none bg-brand-dark-blue px-4 text-sm font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-dark-blue/90 hover:shadow-md active:scale-[0.98] sm:h-12 sm:min-h-12 sm:w-auto sm:flex-[1.3] sm:px-5 sm:text-base"
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
