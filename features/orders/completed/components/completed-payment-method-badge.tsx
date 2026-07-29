"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { PaymentMethod } from "@/features/orders/types";
import { cn } from "@/lib/utils";

const METHOD_STYLES: Record<PaymentMethod, string> = {
  online: "bg-[#8B6BB5]/15 text-[#8B6BB5]",
  manual: "bg-brand-warning/15 text-brand-warning",
};

type CompletedPaymentMethodBadgeProps = {
  method: PaymentMethod;
};

export default function CompletedPaymentMethodBadge({
  method,
}: CompletedPaymentMethodBadgeProps) {
  const t = useTranslations("Orders.Completed.table");

  return (
    <Badge
      className={cn(
        "inline-flex w-full items-center justify-center rounded-lg border-transparent px-3 py-4 text-xs font-medium",
        METHOD_STYLES[method]
      )}
    >
      {method === "online" ? t("paymentOnline") : t("paymentManual")}
    </Badge>
  );
}
