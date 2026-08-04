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
import { useCreateCancelStatus } from "@/features/cancel-statuses/queries/use-create-cancel-status";
import { useUpdateCancelStatus } from "@/features/cancel-statuses/queries/use-update-cancel-status";
import { createCancelStatusFormSchema } from "@/features/cancel-statuses/schemas/cancel-status-form-schema";
import type {
  CancelStatusFormValues,
  CancelStatusRow,
} from "@/features/cancel-statuses/types";
import { cn } from "@/lib/utils";

type CancelStatusFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: CancelStatusRow | null;
};

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const SELECT_TRIGGER_CLASS =
  "h-11! w-full rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm font-medium text-brand-black [&_svg]:text-brand-accent";

const DEFAULT_VALUES: CancelStatusFormValues = {
  textAr: "",
  textEn: "",
  active: true,
};

export default function CancelStatusFormDialog({
  open,
  onOpenChange,
  item = null,
}: CancelStatusFormDialogProps) {
  const t = useTranslations("CancelStatuses.formDialog");
  const locale = useLocale();
  const createItem = useCreateCancelStatus();
  const updateItem = useUpdateCancelStatus();
  const isEdit = Boolean(item);

  const schema = useMemo(
    () =>
      createCancelStatusFormSchema({
        textArRequired: t("validation.textArRequired"),
        textEnRequired: t("validation.textEnRequired"),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelStatusFormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  const isPending = createItem.isPending || updateItem.isPending;

  useEffect(() => {
    if (!open) return;

    reset(
      item
        ? {
            textAr: item.textAr,
            textEn: item.textEn,
            active: item.active,
          }
        : DEFAULT_VALUES,
    );
  }, [open, item, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isPending) return;
      reset(DEFAULT_VALUES);
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
            reset(DEFAULT_VALUES);
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

    createItem.mutate(values, {
      onSuccess: (payload) => {
        toast.success(payload.message || t("toastCreated"));
        reset(DEFAULT_VALUES);
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : t("errorToast"),
        );
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-xl border-none bg-white p-0 ring-0 sm:max-w-lg"
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
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="cancel-status-text-ar"
              className="text-sm font-semibold text-brand-black"
            >
              {t("textArLabel")}{" "}
              <span className="text-brand-accent" aria-hidden>
                *
              </span>
            </Label>
            <Input
              id="cancel-status-text-ar"
              disabled={isPending}
              placeholder={t("textArPlaceholder")}
              aria-invalid={Boolean(errors.textAr)}
              className={FIELD_CLASS}
              {...register("textAr")}
            />
            {errors.textAr ? (
              <p className="text-xs text-brand-accent">
                {errors.textAr.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="cancel-status-text-en"
              className="text-sm font-semibold text-brand-black"
            >
              {t("textEnLabel")}{" "}
              <span className="text-brand-accent" aria-hidden>
                *
              </span>
            </Label>
            <Input
              id="cancel-status-text-en"
              disabled={isPending}
              placeholder={t("textEnPlaceholder")}
              aria-invalid={Boolean(errors.textEn)}
              className={FIELD_CLASS}
              {...register("textEn")}
            />
            {errors.textEn ? (
              <p className="text-xs text-brand-accent">
                {errors.textEn.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-brand-black">
              {t("statusLabel")}
            </Label>
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Select
                  dir={locale === "en" ? "ltr" : "rtl"}
                  value={field.value ? "active" : "inactive"}
                  onValueChange={(value) => field.onChange(value === "active")}
                  disabled={isPending}
                >
                  <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-brand-primary/20">
                    <SelectItem value="active">
                      {t("status.active")}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("status.inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
