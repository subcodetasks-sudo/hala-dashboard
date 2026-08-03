"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { OrderRefundMethod } from "@/features/orders/types";
import { cn } from "@/lib/utils";

const METHOD_STYLES: Record<OrderRefundMethod, string> = {
  bank_transfer: "bg-brand-primary/10 text-brand-primary",
  wallet: "bg-brand-light-yellow text-brand-warning",
  cash: "bg-brand-success-light text-brand-success",
};

const METHOD_LABEL_KEYS = {
  bank_transfer: "methodBankTransfer",
  wallet: "methodWallet",
  cash: "methodCash",
} as const satisfies Record<
  OrderRefundMethod,
  "methodBankTransfer" | "methodWallet" | "methodCash"
>;

type RefundMethodBadgeProps = {
  method: OrderRefundMethod;
};

export default function RefundMethodBadge({ method }: RefundMethodBadgeProps) {
  const t = useTranslations("Orders.Refunds.table");

  return (
    <Badge
      className={cn(
        "w-full rounded-lg border-transparent px-3 py-4",
        METHOD_STYLES[method],
      )}
    >
      {t(METHOD_LABEL_KEYS[method])}
    </Badge>
  );
}
