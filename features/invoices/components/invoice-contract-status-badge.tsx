"use client";

import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import { Badge } from "@/components/ui/badge";
import type { InvoiceContractStatus } from "@/features/invoices/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  InvoiceContractStatus,
  { badge: string; icon: "check" | "warning" }
> = {
  available: {
    badge:
      "border border-brand-primary/30 bg-brand-primary/10 text-brand-primary",
    icon: "check",
  },
  temporarily_unavailable: {
    badge: "border border-brand-accent/30 bg-brand-accent/10 text-brand-accent",
    icon: "warning",
  },
};

type InvoiceContractStatusBadgeProps = {
  status: InvoiceContractStatus;
};

export default function InvoiceContractStatusBadge({
  status,
}: InvoiceContractStatusBadgeProps) {
  const t = useTranslations("Invoices.table");
  const styles = STATUS_STYLES[status];

  return (
    <Badge
      className={cn(
        "inline-flex h-auto items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold",
        styles.badge,
      )}
    >
      {styles.icon === "check" ? (
        <CircleCheck className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
      ) : (
        <CustomIcon
          src="/svg/danger.svg"
          size={14}
          className="shrink-0 text-brand-accent"
        />
      )}
      <span>
        {status === "available"
          ? t("contractAvailable")
          : t("contractUnavailable")}
      </span>
    </Badge>
  );
}
