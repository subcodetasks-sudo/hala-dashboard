"use client";

import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import { Badge } from "@/components/ui/badge";
import type { TrackingStatus } from "@/features/tracking/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  TrackingStatus,
  { badge: string; icon: string }
> = {
  available: {
    badge:
      "border border-brand-primary/25 bg-brand-primary/10 rounded-xl px-4 py-3 text-brand-primary font-bold",
    icon: "text-brand-primary font-bold",
  },
  used: {
    badge:
      "border border-brand-blue/25 bg-brand-blue/10 rounded-xl px-4 py-3 text-brand-blue font-bold",
    icon: "text-brand-blue font-bold",
  },
  disabled: {
    badge:
      "border border-destructive/25 bg-destructive/10 rounded-xl px-4 py-3 text-destructive font-bold",
    icon: "text-destructive font-bold",
  },
};

type TrackingStatusBadgeProps = {
  status: TrackingStatus;
  className?: string;
};

export default function TrackingStatusBadge({
  status,
  className,
}: TrackingStatusBadgeProps) {
  const t = useTranslations("Tracking.filters");
  const styles = STATUS_STYLES[status];

  const renderContent = () => {
    if (status === "available") {
      return (
        <>
          <CircleCheck
            className={cn("shrink-0", styles.icon)}
            strokeWidth={2}
            size={16}
            aria-hidden
          />
          <span>{t("statusAvailable")}</span>
        </>
      );
    }

    if (status === "disabled") {
      return (
        <>
          <CustomIcon
            src="/svg/disabled.svg"
            size={16}
            className={cn("shrink-0", styles.icon)}
            aria-hidden
          />
          <span>{t("statusDisabled")}</span>
        </>
      );
    }

    return (
      <>
        <CustomIcon
          src="/svg/mouse-circle.svg"
          size={16}
          className={cn("shrink-0", styles.icon)}
          aria-hidden
        />
        <span>{t("statusUsed")}</span>
      </>
    );
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex h-auto items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold",
        styles.badge,
        className,
      )}
    >
      {renderContent()}
    </Badge>
  );
}
