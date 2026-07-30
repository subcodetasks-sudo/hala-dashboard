"use client";

import { Eye } from "lucide-react";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import CompletedOrderActions from "@/features/orders/completed/components/completed-order-actions";
import StartReviewAction from "@/features/orders/new/components/start-review-action";
import PaymentOrderActions from "@/features/orders/payment/components/payment-order-actions";
import ProcessedOrderActions from "@/features/orders/processed/components/processed-order-actions";
import type { OrderListItem } from "@/features/orders/types";
import {
  getOrderAssigneeName,
  getOrderEmployerName,
  getOrderWorkerName,
} from "@/features/orders/utils";
import VerificationOrderActions from "@/features/orders/verification/components/verification-order-actions";
import { Link } from "@/i18n/navigation";

type OrderRowActionsProps = {
  order: OrderListItem;
  startReviewLabel: string;
  viewOrderLabel: string;
};

/** Row actions matching each status list page. */
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
            handlerName={getOrderAssigneeName(order, locale)}
            label={startReviewLabel}
          />
        );

      case "processed":
        return (
          <ProcessedOrderActions
            orderId={orderId}
            orderNumber={orderNumber}
            employerName={employerName}
            workerName={workerName}
          />
        );

      case "sent_for_authentication":
        return (
          <VerificationOrderActions
            orderId={orderId}
            orderNumber={orderNumber}
            status="sentForVerification"
          />
        );

      case "awaiting_payment":
        return (
          <PaymentOrderActions orderId={orderId} orderNumber={orderNumber} />
        );

      case "completed":
        return <CompletedOrderActions orderId={orderId} />;

      case "held":
      case "under_review":
      case "cancelled":
      case "draft":
      default:
        return (
          <Button
            type="button"
            asChild
            aria-label={viewOrderLabel}
            className="size-9 rounded-xl border-none bg-brand-primary p-0 text-brand-white hover:bg-brand-primary/90"
          >
            <Link href={`/orders/${orderId}`}>
              <Eye className="size-4" strokeWidth={1.75} />
            </Link>
          </Button>
        );
    }
  })();

  return <div className="flex items-center justify-center">{action}</div>;
}
