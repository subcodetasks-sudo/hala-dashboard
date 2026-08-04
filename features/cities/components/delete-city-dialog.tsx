"use client";

import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteCity } from "@/features/cities/queries/use-delete-city";
import type { CityRow } from "@/features/cities/types";

type DeleteCityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city: CityRow | null;
};

export default function DeleteCityDialog({
  open,
  onOpenChange,
  city,
}: DeleteCityDialogProps) {
  const t = useTranslations("Cities.deleteDialog");
  const locale = useLocale();
  const deleteCity = useDeleteCity();
  const isPending = deleteCity.isPending;

  const displayName =
    locale === "ar"
      ? city?.nameAr || city?.nameEn || ""
      : city?.nameEn || city?.nameAr || "";

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPending) return;
    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    if (isPending || !city) return;

    deleteCity.mutate(city.id, {
      onSuccess: (payload) => {
        toast.success(payload.message || t("toastSuccess"));
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
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-[1.75rem] border-none bg-white p-0 ring-0 sm:max-w-md"
      >
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <DialogTitle className="min-w-0 truncate text-base font-bold text-brand-gris">
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

        <div className="flex min-w-0 flex-col items-center gap-4 px-5 py-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-accent/15">
            <CustomIcon
              src="/svg/trash.svg"
              size={28}
              className="text-brand-accent"
            />
          </div>

          <div className="min-w-0 space-y-2">
            <h3 className="text-xl font-bold text-brand-black">{t("heading")}</h3>
            <DialogDescription className="text-sm leading-relaxed text-brand-gris">
              {t("description")}
            </DialogDescription>
          </div>

          <div className="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl bg-brand-background px-4 py-3 text-start">
            <div className="flex min-w-0 items-center gap-2">
              <CustomIcon
                src="/svg/location.svg"
                size={18}
                className="shrink-0 text-brand-gris"
              />
              <span className="shrink-0 text-sm font-medium text-brand-gris">
                {t("cityLabel")}
              </span>
            </div>
            <span className="min-w-0 truncate text-sm font-bold text-brand-black">
              {displayName}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-center">
          <Button
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className="group relative h-12 w-full flex-[1.4] items-center justify-center gap-2 overflow-hidden rounded-full border-none bg-brand-accent px-5 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-accent/90 hover:shadow-md hover:shadow-brand-accent/20 active:scale-[0.98] sm:w-auto"
          >
            {isPending ? (
              <Spinner className="size-5 text-brand-white" />
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
                <span className="tracking-wide">{t("confirm")}</span>
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

          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="h-12 w-full flex-1 rounded-full bg-[#F5F5F5] font-semibold text-brand-black hover:bg-[#EBEBEB] sm:w-auto"
          >
            {t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
