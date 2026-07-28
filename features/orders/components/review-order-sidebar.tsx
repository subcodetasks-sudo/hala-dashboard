"use client";

import { AlertTriangle, Check, CircleCheck, Copy } from "lucide-react";
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
import {
  NEW_ORDER_CHECKLIST_IDS,
  useReviewChecklist,
} from "@/features/orders/new/queries/use-review-checklist";
import { useOrder } from "@/features/orders/queries/use-orders";
import { copyTextWithFeedback } from "@/features/orders/utils";
import { cn } from "@/lib/utils";

type ReviewOrderSidebarProps = {
  orderId: string;
  isEditing?: boolean;
};

export default function ReviewOrderSidebar({
  orderId,
  isEditing = false,
}: ReviewOrderSidebarProps) {
  const t = useTranslations("Orders.New.Review.sidebar");
  const locale = useLocale();
  const { data: order } = useOrder(orderId);
  const { checklist, toggleChecklistItem, canCompleteReview } =
    useReviewChecklist(orderId);
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isApproveProcessOpen, setApproveProcessOpen] = useState(false);
  const [isPendOrderOpen, setPendOrderOpen] = useState(false);

  if (!order) {
    return null;
  }

  const showReviewActions = order.status === "new" && !isEditing;

  const relativeTime = locale.startsWith("ar")
    ? "10د"
    : order.relativeTimeLabel;

  const handleCopy = () =>
    copyTextWithFeedback(order.orderNumber, { setCopied, setTooltipOpen });

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-72 xl:w-80">
      <section className="rounded-[1.75rem] bg-brand-background/80 p-4">
        <SectionTitle iconSrc="/svg/receipt-3.svg" title={t("orderInfo")} />

        <dl className="mt-1 divide-y divide-black/5">
          <InfoRow iconSrc="/svg/tag-2.svg" label={t("orderNumber")}>
            <span className="inline-flex items-center gap-1.5 font-semibold text-brand-black">
              <span dir="ltr">{order.orderNumber}</span>
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
                "rounded-lg border-transparent px-2.5 py-1 text-xs font-semibold",
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
                <span className="mx-1 text-brand-gris/50">•</span>
                {t("relativeAgo", { time: relativeTime })}
              </p>
            </div>
          </InfoRow>

          <InfoRow iconSrc="/svg/user-square.svg" label={t("assignee")}>
            <span className="rounded-xl border border-black/10 bg-white px-2.5 py-1 text-xs font-semibold text-brand-black">
              {order.assignee}
            </span>
          </InfoRow>

          <InfoRow iconSrc="/svg/document-text.svg" label={t("status")}>
            <Badge className="gap-1.5 rounded-lg border-transparent bg-[#E8913A]/15 px-2.5 py-1 text-xs font-semibold text-[#E8913A]">
              <span
                className="size-1.5 rounded-full bg-[#E8913A]"
                aria-hidden
              />
              {t("statusNew")}
            </Badge>
          </InfoRow>
        </dl>
      </section>

      <section className="rounded-[1.75rem] bg-[#F5F5F5] p-4">
        <SectionTitle iconSrc="/svg/receipt-edit.svg" title={t("checklist")} />

        <ul className="mt-1 divide-y divide-black/5">
          {NEW_ORDER_CHECKLIST_IDS.map((key) => {
            const checked = checklist[key];
            const isNewStatus = order.status === "new";
            return (
              <li key={key}>
                <button
                  type="button"
                  disabled={!isNewStatus}
                  onClick={() => toggleChecklistItem(key)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 py-3 text-start",
                    !isNewStatus && "cursor-default opacity-80"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm leading-snug",
                      checked ? "font-medium text-brand-black" : "text-brand-gris"
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

      {showReviewActions ? (
        <section className="rounded-[1.75rem] bg-[#F5F5F5] p-4">
          <SectionTitle iconSrc="/svg/flash.svg" title={t("actions")} />

          <div className="mt-3 flex flex-col gap-2.5">
            <Button
              type="button"
              disabled={!canCompleteReview}
              onClick={() => setApproveProcessOpen(true)}
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
            <Button
              type="button"
              onClick={() => setPendOrderOpen(true)}
              className="h-12 gap-2 rounded-full border-none bg-[#E8913A] px-4 font-semibold text-brand-white shadow-sm hover:bg-[#E8913A]/90"
            >
              <AlertTriangle className="size-5" strokeWidth={2} />
              {t("suspend")}
            </Button>
          </div>
        </section>
      ) : null}

      <ApproveProcessDialog
        open={isApproveProcessOpen}
        onOpenChange={setApproveProcessOpen}
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
  label,
  children,
}: {
  iconSrc: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <dt className="flex min-w-0 items-center gap-2 text-sm text-brand-gris">
        <CustomIcon
          src={iconSrc}
          size={15}
          className="shrink-0 text-brand-gris"
        />
        <span>{label}</span>
      </dt>
      <dd className="min-w-0 shrink-0 text-sm">{children}</dd>
    </div>
  );
}
