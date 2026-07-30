"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  Download,
  Printer,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import ContractPreviewSkeleton from "@/features/orders/processed/components/contract-preview-skeleton";
import CustomIcon from "@/components/custom-svg";

import { toast } from "sonner";

type ViewDownloadContractDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber?: string;
  onConfirmSend?: () => void;
};

export default function ViewDownloadContractDialog({
  open,
  onOpenChange,
  orderNumber,
  onConfirmSend,
}: ViewDownloadContractDialogProps) {
  const t = useTranslations("Orders.Processed.viewDownloadContractDialog");
  const tAuth = useTranslations("Orders.Processed.sendForAuthDialog");

  const handleConfirmSend = () => {
    if (onConfirmSend) {
      onConfirmSend();
    } else {
      toast.success(tAuth("toastSuccess", { orderNumber: orderNumber ?? "" }));
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar gap-0 overflow-hidden rounded-[1.75rem] border-none bg-white p-6 ring-0 sm:max-w-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <DialogTitle className="text-base font-bold text-brand-black">
            {t("title")}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label={t("close")}
              className="size-9 shrink-0 rounded-xl bg-brand-background p-0 text-brand-gris hover:bg-brand-background/80 hover:text-brand-black"
            >
              <X className="size-4" strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        <DialogDescription className="sr-only">{t("description")}</DialogDescription>

        <div className="px-5 py-5">
          <ContractPreviewSkeleton />
        </div>

        <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-center">
          <Button
            type="button"
            onClick={handleConfirmSend}
            className="group relative h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl border-none bg-brand-primary px-5 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-md hover:shadow-brand-primary/20 active:scale-[0.98] sm:flex-[1.6]"
          >
            <span
              className="confirm-chevron-start inline-flex items-center"
              aria-hidden
            >
              <ChevronsLeft
                className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180"
                strokeWidth={2.25}
              />
            </span>
            <span className="tracking-wide">{t("confirmSend")}</span>
            <span
              className="confirm-chevron-end inline-flex items-center"
              aria-hidden
            >
              <ChevronsRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 ltr:rotate-180"
                strokeWidth={2.25}
              />
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-12 gap-2 rounded-2xl bg-brand-black/5 px-5 font-semibold text-brand-gris hover:bg-brand-black/5 sm:flex-1 hover:text-brand-black/70"
          >
            <Download className="size-4" strokeWidth={1.75} />
            <span>{t("downloadPdf")}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-12 gap-2 rounded-2xl bg-brand-black/5 px-5 font-semibold text-brand-gris hover:bg-brand-black/5 sm:flex-1 hover:text-brand-black/70"
          >
            <CustomIcon
              src="/svg/print.svg"
              size={20}
            />
            <span>{t("print")}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
