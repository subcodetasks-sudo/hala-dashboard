"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { useCreateInquiryType } from "@/features/content-management/queries/use-create-inquiry-type";
import { useUpdateInquiryType } from "@/features/content-management/queries/use-update-inquiry-type";
import {
  createInquiryTypeFormSchema,
  EMPTY_INQUIRY_TYPE_FORM_VALUES,
} from "@/features/content-management/schemas/inquiry-type-form-schema";
import type {
  InquiryTypeFormValues,
  InquiryTypeRow,
  InquiryTypeStatus,
} from "@/features/content-management/types";

type InquiryTypeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: InquiryTypeRow | null;
};

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

export default function InquiryTypeFormDialog({
  open,
  onOpenChange,
  item = null,
}: InquiryTypeFormDialogProps) {
  const t = useTranslations("ContentManagement.support.inquiryTypes.formDialog");
  const createItem = useCreateInquiryType();
  const updateItem = useUpdateInquiryType();
  const isEdit = Boolean(item);

  const schema = useMemo(
    () =>
      createInquiryTypeFormSchema({
        nameArRequired: t("validation.nameArRequired"),
        nameEnRequired: t("validation.nameEnRequired"),
        sortOrderRequired: t("validation.sortOrderRequired"),
        sortOrderInvalid: t("validation.sortOrderInvalid"),
        statusRequired: t("validation.statusRequired"),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryTypeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_INQUIRY_TYPE_FORM_VALUES,
  });

  const isPending = createItem.isPending || updateItem.isPending;

  useEffect(() => {
    if (!open) return;

    reset(
      item
        ? {
            nameAr: item.nameAr,
            nameEn: item.nameEn,
            sortOrder: String(item.sortOrder),
            status:
              item.status === "inactive" ? "inactive" : "active",
          }
        : EMPTY_INQUIRY_TYPE_FORM_VALUES,
    );
  }, [open, item, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isPending) return;
      reset(EMPTY_INQUIRY_TYPE_FORM_VALUES);
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
            reset(EMPTY_INQUIRY_TYPE_FORM_VALUES);
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
          reset(EMPTY_INQUIRY_TYPE_FORM_VALUES);
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
              <Label
                htmlFor="inquiry-name-ar"
                className="text-sm font-semibold text-brand-black"
              >
                {t("nameArLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id="inquiry-name-ar"
                dir="rtl"
                disabled={isPending}
                placeholder={t("nameArPlaceholder")}
                aria-invalid={Boolean(errors.nameAr)}
                className={FIELD_CLASS}
                {...register("nameAr")}
              />
              {errors.nameAr ? (
                <p className="text-xs text-brand-accent">{errors.nameAr.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="inquiry-name-en"
                className="text-sm font-semibold text-brand-black"
              >
                {t("nameEnLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id="inquiry-name-en"
                dir="ltr"
                disabled={isPending}
                placeholder={t("nameEnPlaceholder")}
                aria-invalid={Boolean(errors.nameEn)}
                className={FIELD_CLASS}
                {...register("nameEn")}
              />
              {errors.nameEn ? (
                <p className="text-xs text-brand-accent">{errors.nameEn.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="inquiry-sort-order"
                className="text-sm font-semibold text-brand-black"
              >
                {t("sortOrderLabel")}{" "}
                <span className="text-brand-accent" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id="inquiry-sort-order"
                dir="ltr"
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
                    value={field.value}
                    onValueChange={(value) =>
                      field.onChange(value as InquiryTypeStatus)
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger
                      className="h-11! w-full rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm font-semibold text-brand-black"
                      aria-invalid={Boolean(errors.status)}
                    >
                      <SelectValue placeholder={t("statusPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("status.active")}</SelectItem>
                      <SelectItem value="inactive">
                        {t("status.inactive")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status ? (
                <p className="text-xs text-brand-accent">{errors.status.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
              className="h-11 rounded-full border-black/10 px-5 text-brand-black"
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
