"use client";

import {
  AlertTriangle,
  Check,
  CircleCheck,
  Copy,
  SaudiRiyal,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import CustomIcon from "@/components/custom-svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ApproveProcessDialog from "@/features/orders/new/components/approve-process-dialog";
import PendOrderDialog from "@/features/orders/new/components/pend-order-dialog";
import MarkProcessedDialog from "@/features/orders/pending/components/mark-processed-dialog";
import ConfirmPaymentDialog from "@/features/orders/payment/components/confirm-payment-dialog";
import SendContractForAuthDialog from "@/features/orders/processed/components/send-contract-for-auth-dialog";
import ReviewActionsCard from "@/features/orders/components/review-actions-card";
import ContractQrCodeDialog from "@/features/orders/components/contract-qr-code-dialog";
import ViewDownloadContractDialog from "@/features/orders/components/view-download-contract-dialog";
import UploadFinalContractDialog from "@/features/orders/verification/components/upload-final-contract-dialog";
import {
  NEW_ORDER_CHECKLIST_IDS,
  useReviewChecklist,
} from "@/features/orders/new/queries/use-review-checklist";
import { useOrder } from "@/features/orders/queries/use-orders";
import { copyTextWithFeedback, ORDER_STATUS_LABEL_KEYS } from "@/features/orders/utils";
import { cn } from "@/lib/utils";

type ReviewOrderSidebarProps = {
  orderId: string;
  isEditing?: boolean;
  /** When false, checklist + new/held review actions are read-only (e.g. another employee's under_review). */
  canMutate?: boolean;
};

export default function ReviewOrderSidebar({
  orderId,
  isEditing = false,
  canMutate = true,
}: ReviewOrderSidebarProps) {
  const t = useTranslations("Orders.New.Review.sidebar");
  const tStatus = useTranslations("Orders.New.Review.statuses");
  const locale = useLocale() === "en" ? "en" : "ar";
  const { data: order } = useOrder(orderId);
  const { checklist, toggleChecklistItem, canCompleteReview } =
    useReviewChecklist(orderId, {
      isHeld: order?.status === "held",
      holdReason: order?.hold?.reason,
    });
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isApproveProcessOpen, setApproveProcessOpen] = useState(false);
  const [isMarkProcessedOpen, setMarkProcessedOpen] = useState(false);
  const [isPendOrderOpen, setPendOrderOpen] = useState(false);
  const [isContractDialogOpen, setContractDialogOpen] = useState(false);
  const [isFinalContractDialogOpen, setFinalContractDialogOpen] = useState(false);
  const [isQrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [isSendForAuthOpen, setSendForAuthOpen] = useState(false);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isConfirmPaymentOpen, setConfirmPaymentOpen] = useState(false);

  if (!order) {
    return null;
  }

  // Held / under-review orders keep the checklist and process actions (same as new).
  const isHeld = order.status === "held";
  const isCancelled = order.status === "cancelled";
  const isCompleted = order.status === "completed";
  const isNewOrUnderReview =
    order.status === "new" || order.status === "under_review";
  const isProcessed = order.status === "processed";
  const isSentForAuth = order.status === "sent_for_authentication";
  const isAwaitingPayment = order.status === "awaiting_payment";
  const isReviewableStatus = isNewOrUnderReview || isHeld;
  const canReview = canMutate && isReviewableStatus;
  const showChecklist = !isCancelled;
  const showReviewActions = canReview && !isEditing;
  // Stage actions are independent of form-edit rights (canEditOrderDetail only
  // covers new / under_review / held). Anyone who can open the detail page may act.
  const showProcessedActions = isProcessed && !isEditing;
  const showSentForAuthActions = isSentForAuth && !isEditing;
  const showPaymentActions = isAwaitingPayment && !isEditing;
  const showCompletedActions = isCompleted && !isEditing;
  const statusLabel = tStatus(ORDER_STATUS_LABEL_KEYS[order.status]);

  const relativeTime = order.relativeTimeLabel;
  const isInstantRelative =
    relativeTime === "just now" || relativeTime === "الآن";

  const handleCopy = () =>
    copyTextWithFeedback(order.orderNumber, { setCopied, setTooltipOpen });

  const handleReviewedClick = () => {
    if (isHeld) {
      setMarkProcessedOpen(true);
      return;
    }
    setApproveProcessOpen(true);
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-72 xl:w-80">
      <section className="rounded-[1.75rem] bg-brand-background/80 p-4">
        <SectionTitle iconSrc="/svg/receipt-3.svg" title={t("orderInfo")} />

        <dl className="mt-1 divide-y divide-black/5">
          <InfoRow iconSrc="/svg/tag-2.svg" label={t("orderNumber")}>
            <span className="inline-flex items-center gap-1.5 font-semibold text-brand-black">
              <span dir="ltr" className="font-clash">{order.orderNumber}</span>
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
                      className="inline-flex size-6 items-center justify-center rounded-md text-brand-gris transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
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
          </InfoRow>

          <InfoRow iconSrc="/svg/tag-2.svg" label={t("source")}>
            <Badge
              className={cn(
                "rounded-lg border-transparent p-4 text-xs font-semibold",
                order.source === "eform"
                  ? "bg-[#8B6BB5]/15 text-[#8B6BB5]"
                  : "bg-brand-success/15 text-brand-success"
              )}
            >
              {order.source === "eform" ? t("sourceEform") : t("sourceManual")}
            </Badge>
          </InfoRow>

          <InfoRow iconSrc="/svg/timer.svg" label={t("createdAt")}>
            <div className="text-end">
              <p className="font-semibold text-brand-black">
                {order.createdAtLabel}
              </p>
              <p className="mt-0.5 text-xs text-brand-gris" dir="ltr">
                {order.createdTimeLabel}
                {relativeTime ? (
                  <>
                    <span className="mx-1 text-brand-gris/50">•</span>
                    {isInstantRelative
                      ? relativeTime
                      : t("relativeAgo", { time: relativeTime })}
                  </>
                ) : null}
              </p>
            </div>
          </InfoRow>

          <InfoRow iconSrc="/svg/user-square.svg" label={t("assignee")}>
            <Badge className="rounded-lg border border-black/10 bg-white p-4 text-xs font-semibold text-brand-black">
              {order.assignee}
            </Badge>
          </InfoRow>

          <InfoRow iconSrc="/svg/document-text.svg" label={t("status")}>
            <Badge
              className={cn(
                "gap-1.5 rounded-lg border-transparent p-4 text-xs font-semibold",
                isCancelled
                  ? "bg-brand-accent/10 text-brand-accent"
                  : isCompleted
                    ? "bg-brand-success-light text-brand-success"
                    : "bg-brand-warning/15 text-brand-warning"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isCancelled
                    ? "bg-brand-accent"
                    : isCompleted
                      ? "bg-brand-success"
                      : "bg-brand-warning"
                )}
                aria-hidden
              />
              {statusLabel}
            </Badge>
          </InfoRow>

          {isCompleted && order.plan ? (
            <>
              <InfoRow iconSrc="/svg/receipt-item.svg" label={t("plan")}>
                <span className="font-semibold text-brand-black">
                  {locale === "ar" ? order.plan.title_ar : order.plan.title_en}
                </span>
              </InfoRow>

              <InfoRow
                icon={<SaudiRiyal className="size-4" strokeWidth={1.75} />}
                label={t("planPrice")}
              >
                <span
                  dir="ltr"
                  className="font-clash inline-flex items-center gap-1 font-semibold text-brand-black"
                >
                  <span>
                    {new Intl.NumberFormat("en-US").format(order.plan.price)}
                  </span>
                  <SaudiRiyal
                    className="size-4 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </span>
              </InfoRow>
            </>
          ) : null}
        </dl>
      </section>

      {showChecklist ? (
        <section className="rounded-[1.75rem] bg-[#F5F5F5] p-4">
          <SectionTitle iconSrc="/svg/receipt-edit.svg" title={t("checklist")} />

          <ul className="mt-1 divide-y divide-black/5">
            {NEW_ORDER_CHECKLIST_IDS.map((key) => {
              // Interactive only when the viewer may mutate this reviewable order.
              // Later stages are treated as complete; read-only viewers keep real checklist state.
              const checked = isReviewableStatus ? checklist[key] : true;
              return (
                <li key={key}>
                  <button
                    type="button"
                    disabled={!canReview}
                    onClick={() => toggleChecklistItem(key)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 py-3 text-start",
                      !canReview && "cursor-default opacity-80"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm leading-snug",
                        checked
                          ? "font-medium text-brand-black"
                          : "text-brand-gris"
                      )}
                    >
                      {t(key)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        checked
                          ? "border-brand-success bg-brand-success text-brand-white"
                          : "border-brand-gris/30 bg-white"
                      )}
                      aria-hidden
                    >
                      {checked ? (
                        <Check className="size-3" strokeWidth={3} />
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {showReviewActions ? (
        <section className="rounded-[1.75rem] bg-[#F5F5F5] p-4">
          <SectionTitle iconSrc="/svg/flash.svg" title={t("actions")} />

          <div className="mt-3 flex flex-col gap-2.5">
            <Button
              type="button"
              disabled={!canCompleteReview}
              onClick={handleReviewedClick}
              className={cn(
                "h-12 gap-2 rounded-full border-none bg-brand-primary px-4 font-semibold text-brand-white shadow-sm",
                canCompleteReview
                  ? "hover:bg-brand-primary/90"
                  : "disabled:pointer-events-none disabled:opacity-40"
              )}
            >
              <CircleCheck className="size-5" strokeWidth={2} />
              {t("reviewed")}
            </Button>
            {isNewOrUnderReview ? (
              <Button
                type="button"
                onClick={() => setPendOrderOpen(true)}
                className="h-12 gap-2 rounded-full border-none bg-brand-warning px-4 font-semibold text-brand-white shadow-sm hover:bg-brand-warning/90"
              >
                <AlertTriangle className="size-5" strokeWidth={2} />
                {t("suspend")}
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}

      {showProcessedActions ? (
        <ReviewActionsCard
          title={t("actions")}
          actions={[
            {
              label: t("sendForAuth"),
              iconSrc: "/svg/maximize.svg",
              variant: "primary",
              onClick: () => setSendForAuthOpen(true),
            },
            {
              label: t("showContract"),
              iconSrc: "/svg/receipt-item.svg",
              variant: "secondary",
              onClick: () => setContractDialogOpen(true),
            },
          ]}
        />
      ) : null}

      {showSentForAuthActions ? (
        <ReviewActionsCard
          title={t("actions")}
          actions={[
            {
              label: t("uploadFinalContract"),
              iconSrc: "/svg/maximize.svg",
              variant: "primary",
              onClick: () => setUploadDialogOpen(true),
            },
            {
              label: t("showContract"),
              iconSrc: "/svg/receipt-item.svg",
              variant: "secondary",
              onClick: () => setContractDialogOpen(true),
            },
          ]}
        />
      ) : null}

      {showPaymentActions ? (
        <ReviewActionsCard
          title={t("actions")}
          actions={[
            {
              label: t("confirmPayment"),
              iconSrc: "/svg/money-send.svg",
              variant: "primary",
              onClick: () => setConfirmPaymentOpen(true),
            },
            {
              label: t("showContract"),
              iconSrc: "/svg/receipt-item.svg",
              variant: "secondary",
              onClick: () => setContractDialogOpen(true),
            },
          ]}
        />
      ) : null}

      {showCompletedActions ? (
        <ReviewActionsCard
          title={t("actions")}
          actions={[
            {
              label: t("viewFinalContract"),
              iconSrc: "/svg/receipt-item.svg",
              variant: "primary",
              disabled: !order.hasFinalContract,
              onClick: () => setFinalContractDialogOpen(true),
            },
            {
              label: t("qrCode"),
              iconSrc: "/svg/scan-barcode.svg",
              variant: "secondary",
              disabled: !(order.finalContractUrl || order.contractUrl),
              onClick: () => setQrCodeDialogOpen(true),
            },
          ]}
        />
      ) : null}

      <ApproveProcessDialog
        open={isApproveProcessOpen}
        onOpenChange={setApproveProcessOpen}
        orderId={order.id}
        orderNumber={order.orderNumber}
        employerName={order.employerName}
        workerName={order.workerName}
      />

      <MarkProcessedDialog
        open={isMarkProcessedOpen}
        onOpenChange={setMarkProcessedOpen}
        orderId={order.id}
        orderNumber={order.orderNumber}
        employerName={order.employerName}
        workerName={order.workerName}
      />

      <PendOrderDialog
        open={isPendOrderOpen}
        onOpenChange={setPendOrderOpen}
        orderId={order.id}
      />

      <ViewDownloadContractDialog
        open={isContractDialogOpen}
        onOpenChange={setContractDialogOpen}
        orderId={order.id}
        orderNumber={order.orderNumber}
        showConfirmAction={showProcessedActions}
        onConfirmSend={
          showProcessedActions
            ? () => {
                setContractDialogOpen(false);
                setSendForAuthOpen(true);
              }
            : undefined
        }
      />

      <ViewDownloadContractDialog
        open={isFinalContractDialogOpen}
        onOpenChange={setFinalContractDialogOpen}
        orderId={order.id}
        orderNumber={order.orderNumber}
        showConfirmAction={false}
      />

      <ContractQrCodeDialog
        open={isQrCodeDialogOpen}
        onOpenChange={setQrCodeDialogOpen}
        contractLink={order.finalContractUrl || order.contractUrl}
      />

      <UploadFinalContractDialog
        open={isUploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        orderId={order.id}
        orderNumber={order.orderNumber}
      />

      <SendContractForAuthDialog
        open={isSendForAuthOpen}
        onOpenChange={setSendForAuthOpen}
        orderId={order.id}
        orderNumber={order.orderNumber}
        employerName={order.employerName}
        workerName={order.workerName}
      />

      <ConfirmPaymentDialog
        open={isConfirmPaymentOpen}
        onOpenChange={setConfirmPaymentOpen}
        orderId={order.id}
        orderNumber={order.orderNumber}
      />
    </aside>
  );
}

function SectionTitle({
  iconSrc,
  title,
}: {
  iconSrc: string;
  title: string;
}) {
  return (
    <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-black">
      <CustomIcon src={iconSrc} size={18} />
      <span>{title}</span>
    </h3>
  );
}

function InfoRow({
  iconSrc,
  icon,
  label,
  children,
}: {
  iconSrc?: string;
  icon?: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <dt className="flex min-w-0 items-center gap-2 text-sm text-brand-gris">
        {iconSrc ? (
          <CustomIcon
            src={iconSrc}
            size={15}
            className="shrink-0 text-brand-gris"
          />
        ) : (
          <span className="shrink-0 text-brand-gris">{icon}</span>
        )}
        <span>{label}</span>
      </dt>
      <dd className="min-w-0 shrink-0 text-sm">{children}</dd>
    </div>
  );
}
