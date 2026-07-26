"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  Copy,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStartReview } from "@/features/orders/new/context/start-review-context";
import { copyTextWithFeedback } from "@/features/orders/utils";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function StartReviewDialog() {
  const t = useTranslations("Orders.New.startReviewDialog");
  const router = useRouter();
  const { order, isOpen, setOpen, closeStartReview } = useStartReview();
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = () => {
    if (!order?.orderNumber) return;
    void copyTextWithFeedback(order.orderNumber, {
      setCopied,
      setTooltipOpen,
    });
  };

  const handleConfirm = () => {
    if (!order) return;
    const orderId = order.id;
    closeStartReview();
    router.push(`/orders/${orderId}`);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCopied(false);
      setTooltipOpen(false);
    }
    setOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="gap-0 overflow-hidden rounded-[1.75rem] border-none bg-white p-6 ring-0 sm:max-w-md"
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

        <div className="flex flex-col items-center gap-4 px-5 py-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-3xl bg-brand-primary/10">
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

          <div className="w-full rounded-[1.5rem] bg-brand-primary/10 px-4 py-1 text-start">
            <DetailRow
              icon={
                <CustomIcon
                  src="/svg/tag-2.svg"
                  size={16}
                  className="text-brand-gris"
                />
              }
              label={t("orderNumber")}
              value={
                <span className="inline-flex items-center gap-2 font-semibold text-brand-black">
                  <span dir="ltr">{order?.orderNumber}</span>
                  <TooltipProvider>
                    <Tooltip
                      open={tooltipOpen}
                      onOpenChange={(open) => {
                        if (copied) return;
                        setTooltipOpen(open);
                      }}
                    >
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={handleCopy}
                          aria-label={copied ? t("copied") : t("copy")}
                          className="inline-flex size-7 items-center justify-center rounded-md text-brand-gris transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
                        >
                          <Copy className="size-3.5" strokeWidth={1.75} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={6}>
                        <p>{copied ? t("copied") : t("copy")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              }
            />
            <DetailRow
              icon={
                <CustomIcon
                  src="/svg/user-square.svg"
                  size={16}
                  className="text-brand-gris"
                />
              }
              label={t("employerName")}
              value={order?.customerName}
            />
            <DetailRow
              icon={
                <CustomIcon
                  src="/svg/user-tag.svg"
                  size={16}
                  className="text-brand-gris"
                />
              }
              label={t("workerName")}
              value={order?.handlerName}
              showDivider={false}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 px-5 pb-5 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="ghost"
            onClick={closeStartReview}
            className="h-12 flex-1 rounded-2xl bg-brand-background font-semibold text-brand-black hover:bg-brand-background/80"
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="group relative h-12 flex-[1.4] items-center justify-center gap-2 overflow-hidden rounded-2xl border-none bg-brand-primary px-5 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-md hover:shadow-brand-primary/20 active:scale-[0.98]"
          >
            <span className="confirm-chevron-start inline-flex items-center" aria-hidden>
              <ChevronsLeft
                className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180"
                strokeWidth={2.25}
              />
            </span>
            <span className="tracking-wide">{t("confirm")}</span>
            <span className="confirm-chevron-end inline-flex items-center" aria-hidden>
              <ChevronsRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 ltr:rotate-180"
                strokeWidth={2.25}
              />
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon,
  label,
  value,
  showDivider = true,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  showDivider?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-3.5",
        showDivider && "border-b border-black/5"
      )}
    >
      <div className="flex min-w-0 items-center gap-2 text-sm text-brand-gris">
        {icon}
        <span>{label}</span>
      </div>
      <div className="min-w-0 text-sm font-semibold text-brand-black">
        {value}
      </div>
    </div>
  );
}
