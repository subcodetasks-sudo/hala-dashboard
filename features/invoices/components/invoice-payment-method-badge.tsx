"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { PaymentMethod } from "@/features/invoices/types";
import { cn } from "@/lib/utils";

/** Design: Manual = purple + dot, Online = orange + dot. */
const METHOD_STYLES: Record<PaymentMethod, { badge: string; dot: string }> = {
  manual: {
    badge: "bg-brand-purple/10 text-brand-purple",
    dot: "bg-brand-purple",
  },
  online: {
    badge: "bg-brand-light-yellow text-brand-warning",
    dot: "bg-brand-warning",
  },
};

type InvoicePaymentMethodBadgeProps = {
  method: PaymentMethod;
};

export default function InvoicePaymentMethodBadge({
  method,
}: InvoicePaymentMethodBadgeProps) {
  const t = useTranslations("Invoices.table");
  const styles = METHOD_STYLES[method];

  return (
    <Badge
      className={cn(
        "inline-flex h-auto items-center gap-1.5 rounded-xl border-transparent px-4 py-2.5 text-xs font-bold",
        styles.badge,
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", styles.dot)}
        aria-hidden
      />
      <span>{method === "online" ? t("paymentOnline") : t("paymentManual")}</span>
    </Badge>
  );
}
