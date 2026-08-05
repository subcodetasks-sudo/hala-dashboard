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
import { useDeleteInquiryType } from "@/features/content-management/queries/use-delete-inquiry-type";
import type { InquiryTypeRow } from "@/features/content-management/types";

type DeleteInquiryTypeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InquiryTypeRow | null;
};

export default function DeleteInquiryTypeDialog({
  open,
  onOpenChange,
  item,
}: DeleteInquiryTypeDialogProps) {
  const t = useTranslations(
    "ContentManagement.support.inquiryTypes.deleteDialog",
  );
  const locale = useLocale();
  const deleteItem = useDeleteInquiryType();
  const isPending = deleteItem.isPending;

  const displayName =
    locale === "ar"
      ? item?.nameAr || item?.nameEn || ""
      : item?.nameEn || item?.nameAr || "";

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPending) return;
    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    if (isPending || !item) return;

    deleteItem.mutate(item.id, {
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

        <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-accent/10">
            <CustomIcon
              src="/svg/trash.svg"
              size={28}
              className="text-brand-accent"
            />
          </span>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-brand-black">{t("heading")}</h3>
            <DialogDescription className="text-sm text-brand-gris">
              {t("description")}
            </DialogDescription>
            {displayName ? (
              <p className="text-sm font-semibold text-brand-dark-blue">
                {t("itemLabel")}: {displayName}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-black/5 px-5 py-4">
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
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className="group relative h-11 gap-2 overflow-hidden rounded-full bg-brand-accent px-6 text-brand-white hover:bg-brand-accent/90"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
