"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
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
import { useCreateFaqItem } from "@/features/content-management/queries/use-create-faq-item";
import { useUpdateFaqItem } from "@/features/content-management/queries/use-update-faq-item";
import {
  createFaqItemFormSchema,
  EMPTY_FAQ_ITEM_FORM_VALUES,
} from "@/features/content-management/schemas/faq-item-form-schema";
import type {
  FaqItemFormValues,
  FaqItemRow,
} from "@/features/content-management/types";
import { cn } from "@/lib/utils";

type FaqItemFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: FaqItemRow | null;
};

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const TEXTAREA_CLASS =
  "min-h-24 rounded-2xl border border-black/10 bg-[#FBFBFB] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gris/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 disabled:opacity-50";

export default function FaqItemFormDialog({
  open,
  onOpenChange,
  item = null,
}: FaqItemFormDialogProps) {
  const t = useTranslations("ContentManagement.faqs.items.formDialog");
  const createItem = useCreateFaqItem();
  const updateItem = useUpdateFaqItem();
  const isEdit = Boolean(item);

  const schema = useMemo(
    () =>
      createFaqItemFormSchema({
        questionArRequired: t("validation.questionArRequired"),
        questionEnRequired: t("validation.questionEnRequired"),
        answerArRequired: t("validation.answerArRequired"),
        answerEnRequired: t("validation.answerEnRequired"),
        sortOrderRequired: t("validation.sortOrderRequired"),
        sortOrderInvalid: t("validation.sortOrderInvalid"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_FAQ_ITEM_FORM_VALUES,
  });

  const isPending = createItem.isPending || updateItem.isPending;

  useEffect(() => {
    if (!open) return;

    reset(
      item
        ? {
            questionAr: item.questionAr,
            questionEn: item.questionEn,
            answerAr: item.answerAr,
            answerEn: item.answerEn,
            sortOrder: String(item.sortOrder),
          }
        : EMPTY_FAQ_ITEM_FORM_VALUES,
    );
  }, [open, item, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isPending) return;
      reset(EMPTY_FAQ_ITEM_FORM_VALUES);
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
            reset(EMPTY_FAQ_ITEM_FORM_VALUES);
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
          reset(EMPTY_FAQ_ITEM_FORM_VALUES);
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="faq-question-ar" className="text-sm font-semibold text-brand-black">
                {t("questionArLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input
                id="faq-question-ar"
                dir="rtl"
                disabled={isPending}
                placeholder={t("questionArPlaceholder")}
                aria-invalid={Boolean(errors.questionAr)}
                className={FIELD_CLASS}
                {...register("questionAr")}
              />
              {errors.questionAr ? (
                <p className="text-xs text-brand-accent">{errors.questionAr.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="faq-question-en" className="text-sm font-semibold text-brand-black">
                {t("questionEnLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <Input
                id="faq-question-en"
                dir="ltr"
                disabled={isPending}
                placeholder={t("questionEnPlaceholder")}
                aria-invalid={Boolean(errors.questionEn)}
                className={FIELD_CLASS}
                {...register("questionEn")}
              />
              {errors.questionEn ? (
                <p className="text-xs text-brand-accent">{errors.questionEn.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="faq-answer-ar" className="text-sm font-semibold text-brand-black">
                {t("answerArLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <textarea
                id="faq-answer-ar"
                dir="rtl"
                disabled={isPending}
                placeholder={t("answerArPlaceholder")}
                aria-invalid={Boolean(errors.answerAr)}
                className={TEXTAREA_CLASS}
                {...register("answerAr")}
              />
              {errors.answerAr ? (
                <p className="text-xs text-brand-accent">{errors.answerAr.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="faq-answer-en" className="text-sm font-semibold text-brand-black">
                {t("answerEnLabel")} <span className="text-brand-accent" aria-hidden>*</span>
              </Label>
              <textarea
                id="faq-answer-en"
                dir="ltr"
                disabled={isPending}
                placeholder={t("answerEnPlaceholder")}
                aria-invalid={Boolean(errors.answerEn)}
                className={TEXTAREA_CLASS}
                {...register("answerEn")}
              />
              {errors.answerEn ? (
                <p className="text-xs text-brand-accent">{errors.answerEn.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="faq-sort-order" className="text-sm font-semibold text-brand-black">
              {t("sortOrderLabel")} <span className="text-brand-accent" aria-hidden>*</span>
            </Label>
            <Input
              id="faq-sort-order"
              inputMode="numeric"
              disabled={isPending}
              placeholder={t("sortOrderPlaceholder")}
              aria-invalid={Boolean(errors.sortOrder)}
              className={FIELD_CLASS}
              {...register("sortOrder")}
            />
            {errors.sortOrder ? (
              <p className="text-xs text-brand-accent">{errors.sortOrder.message}</p>
            ) : null}
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
