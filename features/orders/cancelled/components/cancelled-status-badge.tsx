"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

type CancelledStatusBadgeProps = {
  label?: string | null;
};

export default function CancelledStatusBadge({
  label,
}: CancelledStatusBadgeProps) {
  const t = useTranslations("Orders.Cancelled");

  return (
    <Badge className="inline-flex items-center gap-1.5 rounded-xl border-transparent bg-brand-accent/10 p-5 text-xs font-medium text-brand-accent">
      <span
        className="size-1.5 shrink-0 rounded-full bg-brand-accent"
        aria-hidden
      />
      <span>{label?.trim() || t("table.statusCancelled")}</span>
    </Badge>
  );
}
