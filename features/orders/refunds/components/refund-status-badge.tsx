"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { OrderRefundStatus } from "@/features/orders/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  OrderRefundStatus,
  { badge: string; dot: string }
> = {
  pending: {
    badge: "bg-brand-purple/15 text-brand-purple",
    dot: "bg-brand-purple",
  },
  approved: {
    badge: "bg-brand-primary/10 text-brand-primary",
    dot: "bg-brand-primary",
  },
  rejected: {
    badge: "bg-brand-accent/10 text-brand-accent",
    dot: "bg-brand-accent",
  },
  completed: {
    badge: "bg-brand-light-yellow text-brand-warning",
    dot: "bg-brand-warning",
  },
};

const STATUS_LABEL_KEYS = {
  pending: "statusPending",
  approved: "statusApproved",
  rejected: "statusRejected",
  completed: "statusCompleted",
} as const satisfies Record<
  OrderRefundStatus,
  "statusPending" | "statusApproved" | "statusRejected" | "statusCompleted"
>;

type RefundStatusBadgeProps = {
  status: OrderRefundStatus;
};

export default function RefundStatusBadge({ status }: RefundStatusBadgeProps) {
  const t = useTranslations("Orders.Refunds.table");
  const styles = STATUS_STYLES[status];

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border-transparent p-5 text-xs font-bold",
        styles.badge,
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", styles.dot)}
        aria-hidden
      />
      <span>{t(STATUS_LABEL_KEYS[status])}</span>
    </Badge>
  );
}
