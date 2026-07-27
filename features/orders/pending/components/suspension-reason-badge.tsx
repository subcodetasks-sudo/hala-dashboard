import {
  FileText,
  FileUser,
  FileWarning,
  RefreshCw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import type { SuspensionReason } from "@/features/orders/types";
import { cn } from "@/lib/utils";

const REASON_META: Record<
  SuspensionReason,
  { className: string; icon: ReactNode }
> = {
  missingDocument: {
    className: "bg-[#F3E8FF] text-[#8B5CF6]",
    icon: <FileText className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  incompleteWorkerData: {
    className: "bg-[#FEF6E0] text-[#B8860B]",
    icon: <FileUser className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  incompleteEmployerData: {
    className: "bg-[#FEF6E0] text-[#B8860B]",
    icon: <FileUser className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  unclearDocument: {
    className: "bg-[#FDECEC] text-[#E5484D]",
    icon: <FileWarning className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  dataConflict: {
    className: "bg-[#E8F4FC] text-[#3B82F6]",
    icon: <RefreshCw className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  other: {
    className: "bg-[#F5F5F5] text-brand-gris",
    icon: <FileText className="size-4 shrink-0" strokeWidth={1.75} />,
  },
};

type SuspensionReasonBadgeProps = {
  reason: SuspensionReason;
  className?: string;
};

export default function SuspensionReasonBadge({
  reason,
  className,
}: SuspensionReasonBadgeProps) {
  const t = useTranslations("Orders.Pending.reasons");
  const meta = REASON_META[reason];

  return (
    <Badge
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl border-transparent p-5 text-xs font-semibold whitespace-nowrap",
        meta.className,
        className
      )}
    >
      {meta.icon}
      <span>{t(reason)}</span>
    </Badge>
  );
}
