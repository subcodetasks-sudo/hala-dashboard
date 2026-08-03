"use client";

import { Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ViewDownloadContractDialog from "@/features/orders/components/view-download-contract-dialog";
import StartReviewAction from "@/features/orders/new/components/start-review-action";
import ConfirmPaymentDialog from "@/features/orders/payment/components/confirm-payment-dialog";
import SendContractForAuthDialog from "@/features/orders/processed/components/send-contract-for-auth-dialog";
import type { OrderListItem } from "@/features/orders/types";
import {
  getOrderEmployerName,
  getOrderWorkerName,
} from "@/features/orders/utils";
import { useMarkFinalContractUploaded } from "@/features/orders/verification/queries/use-verification-orders";
import { Link } from "@/i18n/navigation";

type OrderRowActionsProps = {
  order: OrderListItem;
  startReviewLabel: string;
  viewOrderLabel: string;
};

type IconActionButtonProps = {
  label: string;
  children: ReactNode;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
};

function IconActionButton({
  label,
  children,
  href,
  disabled,
  onClick,
}: IconActionButtonProps) {
  const buttonClassName =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-xl border-none bg-brand-primary p-0 text-brand-white transition-colors hover:bg-brand-primary/90 disabled:pointer-events-none disabled:opacity-50";

  const trigger = href ? (
    <Link href={href} aria-label={label} className={buttonClassName}>
      {children}
    </Link>
  ) : (
    <Button
      type="button"
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      className={buttonClassName}
    >
      {children}
    </Button>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ViewOrderButton({
  orderId,
  label,
}: {
  orderId: string;
  label: string;
}) {
  return (
    <Button
      type="button"
      asChild
      className="h-9 gap-2 rounded-full border-none bg-brand-primary px-4 text-brand-white hover:bg-brand-primary/90 [a]:hover:bg-brand-primary/90"
    >
      <Link href={`/orders/${orderId}`}>
        <Eye className="size-4" strokeWidth={1.75} />
        <span>{label}</span>
      </Link>
    </Button>
  );
}

function ProcessedInlineActions({
  orderId,
  orderNumber,
  employerName,
  workerName,
}: {
  orderId: string;
  orderNumber: string;
  employerName: string;
  workerName: string;
}) {
  const t = useTranslations("Orders.Processed.table");
  const [isContractDialogOpen, setContractDialogOpen] = useState(false);
  const [isSendForAuthOpen, setSendForAuthOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center gap-1.5">
        <IconActionButton label={t("viewDetails")} href={`/orders/${orderId}`}>
          <Eye className="size-4" strokeWidth={1.75} />
        </IconActionButton>
        <IconActionButton
          label={t("viewDownloadContract")}
          onClick={() => setContractDialogOpen(true)}
        >
          <CustomIcon
            src="/svg/receipt-item.svg"
            size={16}
            className="text-brand-white"
          />
        </IconActionButton>
        <IconActionButton
          label={t("sendForVerification")}
          onClick={() => setSendForAuthOpen(true)}
        >
          <CustomIcon
            src="/svg/maximize.svg"
            size={16}
            className="text-brand-white"
          />
        </IconActionButton>
      </div>

      <ViewDownloadContractDialog
        open={isContractDialogOpen}
        onOpenChange={setContractDialogOpen}
        orderNumber={orderNumber}
      />

      <SendContractForAuthDialog
        open={isSendForAuthOpen}
        onOpenChange={setSendForAuthOpen}
        orderId={orderId}
        orderNumber={orderNumber}
        employerName={employerName}
        workerName={workerName}
      />
    </>
  );
}

function VerificationInlineActions({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: string;
}) {
  const t = useTranslations("Orders.Verification.table");
  const [isContractDialogOpen, setContractDialogOpen] = useState(false);
  const markUploaded = useMarkFinalContractUploaded();

  const handleUploadFinalContract = () => {
    if (markUploaded.isPending) return;

    markUploaded.mutate(orderId, {
      onSuccess: () => {
        toast.success(t("uploadFinalContractSuccess", { orderNumber }));
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-center gap-1.5">
        <IconActionButton label={t("viewDetails")} href={`/orders/${orderId}`}>
          <Eye className="size-4" strokeWidth={1.75} />
        </IconActionButton>
        <IconActionButton
          label={t("viewDownloadContract")}
          onClick={() => setContractDialogOpen(true)}
        >
          <CustomIcon
            src="/svg/receipt-item.svg"
            size={16}
            className="text-brand-white"
          />
        </IconActionButton>
        <IconActionButton
          label={t("uploadFinalContract")}
          disabled={markUploaded.isPending}
          onClick={handleUploadFinalContract}
        >
          <CustomIcon
            src="/svg/maximize.svg"
            size={16}
            className="text-brand-white"
          />
        </IconActionButton>
      </div>

      <ViewDownloadContractDialog
        open={isContractDialogOpen}
        onOpenChange={setContractDialogOpen}
        orderNumber={orderNumber}
      />
    </>
  );
}

function PaymentInlineActions({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: string;
}) {
  const t = useTranslations("Orders.Payment.table");
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center gap-1.5">
        <IconActionButton label={t("viewDetails")} href={`/orders/${orderId}`}>
          <Eye className="size-4" strokeWidth={1.75} />
        </IconActionButton>
        <IconActionButton
          label={t("confirmPayment")}
          onClick={() => setConfirmDialogOpen(true)}
        >
          <CustomIcon
            src="/svg/money-send.svg"
            size={16}
            className="text-brand-white"
          />
        </IconActionButton>
      </div>

      <ConfirmPaymentDialog
        open={isConfirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        orderId={orderId}
        orderNumber={orderNumber}
      />
    </>
  );
}

/** Row actions matching each status list page — compact icons for the home table. */
export default function OrderRowActions({
  order,
  startReviewLabel,
  viewOrderLabel,
}: OrderRowActionsProps) {
  const locale = useLocale() === "en" ? "en" : "ar";
  const orderId = String(order.id);
  const orderNumber = order.request_number ?? `#ORD-${order.id}`;
  const employerName = getOrderEmployerName(order, locale);
  const workerName = getOrderWorkerName(order, locale);

  const action = (() => {
    switch (order.status) {
      case "new":
        return (
          <StartReviewAction
            orderId={orderId}
            orderNumber={orderNumber}
            customerName={employerName}
            handlerName={workerName}
            label={startReviewLabel}
          />
        );

      case "processed":
        return (
          <ProcessedInlineActions
            orderId={orderId}
            orderNumber={orderNumber}
            employerName={employerName}
            workerName={workerName}
          />
        );

      case "sent_for_authentication":
        return (
          <VerificationInlineActions
            orderId={orderId}
            orderNumber={orderNumber}
          />
        );

      case "awaiting_payment":
        return (
          <PaymentInlineActions orderId={orderId} orderNumber={orderNumber} />
        );

      case "completed":
      case "held":
      case "under_review":
      case "cancelled":
      case "draft":
      default:
        return <ViewOrderButton orderId={orderId} label={viewOrderLabel} />;
    }
  })();

  return <div className="flex items-center justify-center">{action}</div>;
}
