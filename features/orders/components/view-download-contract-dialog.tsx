"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  Download,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
import { downloadMusanedContractPdf } from "@/features/orders/components/musaned-contract/download-musaned-contract";
import MusanedContractDocument from "@/features/orders/components/musaned-contract/musaned-contract-document";
import { mapOrderToMusanedContract } from "@/features/orders/components/musaned-contract/map-order-to-musaned-contract";
import { printMusanedContract } from "@/features/orders/components/musaned-contract/print-musaned-contract";
import ContractPreviewSkeleton from "@/features/orders/processed/components/contract-preview-skeleton";
import { useOrder } from "@/features/orders/queries/use-orders";

const CONTRACT_DOC_ID = "musaned-contract-preview-root";

type ViewDownloadContractDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber?: string;
  /** Primary blue action. When false, only print & download are shown. Default true. */
  showConfirmAction?: boolean;
  /** Override label for the primary blue button. */
  confirmLabel?: string;
  /** When false, the primary button is visible but not clickable. */
  confirmDisabled?: boolean;
  onConfirmSend?: () => void;
};

export default function ViewDownloadContractDialog({
  open,
  onOpenChange,
  orderId,
  orderNumber,
  showConfirmAction = true,
  confirmLabel,
  confirmDisabled = false,
  onConfirmSend,
}: ViewDownloadContractDialogProps) {
  const t = useTranslations("Orders.Processed.viewDownloadContractDialog");
  const tAuth = useTranslations("Orders.Processed.sendForAuthDialog");
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: order, isLoading, isError } = useOrder(open ? orderId : "");

  const handleConfirmSend = () => {
    if (confirmDisabled) return;

    if (onConfirmSend) {
      onConfirmSend();
    } else {
      toast.success(tAuth("toastSuccess", { orderNumber: orderNumber ?? "" }));
    }
    onOpenChange(false);
  };

  const handlePrint = () => {
    printMusanedContract(CONTRACT_DOC_ID);
  };

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadMusanedContractPdf(
        CONTRACT_DOC_ID,
        orderNumber ? `musaned-contract-${orderNumber}` : "musaned-contract",
      );
    } catch {
      toast.error(t("downloadError"));
    } finally {
      setIsDownloading(false);
    }
  };

  const contractData = order ? mapOrderToMusanedContract(order) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar flex max-h-[92vh] flex-col gap-0 overflow-hidden rounded-[1.75rem] border-none bg-white p-0 ring-0 sm:max-w-4xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
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

        <div className="min-h-0 flex-1 overflow-y-auto bg-brand-background/40 px-4 py-5 sm:px-6">
          {isLoading ? (
            <ContractPreviewSkeleton />
          ) : isError || !contractData ? (
            <p className="py-10 text-center text-sm text-brand-gris">
              {t("description")}
            </p>
          ) : (
            <div className="mx-auto w-full max-w-[210mm] origin-top scale-[0.72] sm:scale-[0.85] lg:scale-100">
              <MusanedContractDocument
                id={CONTRACT_DOC_ID}
                data={contractData}
              />
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-black/10 px-5 py-4 sm:flex-row sm:items-center">
          {showConfirmAction ? (
            <Button
              type="button"
              onClick={handleConfirmSend}
              disabled={confirmDisabled || isDownloading}
              className="group relative h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl border-none bg-brand-primary px-5 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-md hover:shadow-brand-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:flex-[1.6]"
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
              <span className="tracking-wide">
                {confirmLabel ?? t("confirmSend")}
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
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            disabled={!contractData || isDownloading}
            onClick={() => {
              void handleDownload();
            }}
            className="h-12 gap-2 rounded-2xl bg-brand-black/5 px-5 font-semibold text-brand-gris hover:bg-brand-black/5 hover:text-brand-black/70 disabled:opacity-50 sm:flex-1"
          >
            <Download className="size-4" strokeWidth={1.75} />
            <span>{isDownloading ? t("downloadingPdf") : t("downloadPdf")}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={!contractData || isDownloading}
            onClick={handlePrint}
            className="h-12 gap-2 rounded-2xl bg-brand-black/5 px-5 font-semibold text-brand-gris hover:bg-brand-black/5 hover:text-brand-black/70 disabled:opacity-50 sm:flex-1"
          >
            <CustomIcon src="/svg/print.svg" size={20} />
            <span>{t("print")}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
