"use client";

import { ChevronsLeft, ChevronsRight, Eye, X } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { cn } from "@/lib/utils";

type ReplaceDocumentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
  documentMeta: string;
  documentUrl: string;
  iconSrc: string;
  iconClassName: string;
  bgClassName: string;
  isPending?: boolean;
  onConfirm: () => void;
};

export default function ReplaceDocumentDialog({
  open,
  onOpenChange,
  documentTitle,
  documentMeta,
  documentUrl,
  iconSrc,
  iconClassName,
  bgClassName,
  isPending = false,
  onConfirm,
}: ReplaceDocumentDialogProps) {
  const t = useTranslations("Orders.Pending.replaceDocumentDialog");

  const handleConfirm = () => {
    if (isPending) return;
    onConfirm();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPending) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar w-[calc(100%-2rem)] p-6 gap-0 overflow-hidden rounded-lg border-none bg-white ring-0 sm:max-w-md"
      >
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
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

        <div className="flex flex-col items-center gap-4 px-5 py-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-primary/10">
            <CustomIcon
              src="/svg/receipt-item.svg"
              size={28}
              className="text-brand-primary"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-brand-black">{t("heading")}</h3>
            <DialogDescription className="text-sm leading-relaxed text-brand-gris">
              {t("description")}
            </DialogDescription>
          </div>

          <div className="flex w-full items-center gap-3 rounded-2xl border border-black/5 bg-brand-background/40 px-3 py-3 text-start">
            <span
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
                bgClassName,
                iconClassName
              )}
            >
              <CustomIcon src={iconSrc} size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-brand-black">
                {documentTitle}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-brand-gris">
                {documentMeta}
              </p>
            </div>
            <Button
              variant="ghost"
              asChild
              // Soft purple — not a brand token
              className="h-10 shrink-0 gap-1.5 rounded-full bg-[#F3E8FF] px-4 font-semibold text-[#7C3AED] shadow-none hover:bg-[#EDE0FF] hover:text-[#7C3AED]"
            >
              <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="size-4" strokeWidth={1.75} />
                {t("view")}
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 px-5 pb-5 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="h-12 flex-1 rounded-2xl bg-brand-background font-semibold text-brand-black hover:bg-brand-background/80"
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className="group relative h-12 flex-[1.4] items-center justify-center gap-2 overflow-hidden rounded-2xl border-none bg-brand-primary px-5 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-md hover:shadow-brand-primary/20 active:scale-[0.98]"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
