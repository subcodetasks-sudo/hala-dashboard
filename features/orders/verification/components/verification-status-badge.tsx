"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { VerificationOrderStatus } from "@/features/orders/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  VerificationOrderStatus,
  { badge: string; dot: string }
> = {
  sentForVerification: {
    badge: "bg-[#F3EDF8] text-[#8B6BB5]",
    dot: "bg-[#8B6BB5]",
  },
  finalContractUploaded: {
    badge: "bg-brand-light-yellow text-brand-warning",
    dot: "bg-brand-warning",
  },
};

type VerificationStatusBadgeProps = {
  status: VerificationOrderStatus;
};

export default function VerificationStatusBadge({
  status,
}: VerificationStatusBadgeProps) {
  const t = useTranslations("Orders.Verification.table");
  const styles = STATUS_STYLES[status];

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border-transparent p-5 text-xs font-medium",
        styles.badge
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", styles.dot)} aria-hidden />
      <span>
        {status === "sentForVerification"
          ? t("statusSentForVerification")
          : t("statusFinalContractUploaded")}
      </span>
    </Badge>
  );
}
