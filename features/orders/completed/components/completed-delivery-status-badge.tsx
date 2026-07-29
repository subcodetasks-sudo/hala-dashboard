"use client";

import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import { Badge } from "@/components/ui/badge";
import type { DeliveryStatus } from "@/features/orders/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<DeliveryStatus, string> = {
  required: "bg-brand-success/15 text-brand-success",
  notRequired: "bg-[#F5F5F5] text-brand-gris",
};

type CompletedDeliveryStatusBadgeProps = {
  status: DeliveryStatus;
};

export default function CompletedDeliveryStatusBadge({
  status,
}: CompletedDeliveryStatusBadgeProps) {
  const t = useTranslations("Orders.Completed.table");

  return (
    <Badge
      className={cn(
        "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border-transparent px-3 py-4 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {status === "required" ? (
        <CustomIcon
          src="/svg/truck.svg"
          size={14}
          className="shrink-0 text-brand-success"
        />
      ) : null}
      <span>
        {status === "required"
          ? t("deliveryRequired")
          : t("deliveryNotRequired")}
      </span>
    </Badge>
  );
}
