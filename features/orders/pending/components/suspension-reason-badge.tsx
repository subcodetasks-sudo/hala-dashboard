import {
  FileText,
  FileUser,
  FileWarning,
  RefreshCw,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { useHoldReasons } from "@/features/orders/pending/queries/use-hold-reasons";
import type { HoldReasonValue } from "@/features/orders/types";
import { cn } from "@/lib/utils";

const REASON_META: Record<
  HoldReasonValue,
  { className: string; icon: ReactNode }
> = {
  missing_document: {
    className: "bg-[#F3E8FF] text-[#8B5CF6]",
    icon: <FileText className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  worker_data_unclear: {
    className: "bg-[#FEF6E0] text-[#B8860B]",
    icon: <FileUser className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  employer_data_incomplete: {
    className: "bg-[#FEF6E0] text-[#B8860B]",
    icon: <FileUser className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  unclear_document: {
    className: "bg-[#FDECEC] text-[#E5484D]",
    icon: <FileWarning className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  data_conflict: {
    className: "bg-[#E8F4FC] text-[#3B82F6]",
    icon: <RefreshCw className="size-4 shrink-0" strokeWidth={1.75} />,
  },
  other: {
    className: "bg-[#F5F5F5] text-brand-gris",
    icon: <FileText className="size-4 shrink-0" strokeWidth={1.75} />,
  },
};

const FALLBACK_META = {
  className: "bg-[#F5F5F5] text-brand-gris",
  icon: <FileText className="size-4 shrink-0" strokeWidth={1.75} />,
};

type SuspensionReasonBadgeProps = {
  reason: HoldReasonValue | string;
  label?: string | null;
  className?: string;
};

export default function SuspensionReasonBadge({
  reason,
  label,
  className,
}: SuspensionReasonBadgeProps) {
  const { data: holdReasons } = useHoldReasons();
  const meta =
    REASON_META[reason as HoldReasonValue] ?? FALLBACK_META;
  const resolvedLabel =
    label ||
    holdReasons?.find((item) => item.value === reason)?.label ||
    reason;

  return (
    <Badge
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl border-transparent p-5 text-xs font-semibold whitespace-nowrap",
        meta.className,
        className
      )}
    >
      {meta.icon}
      <span>{resolvedLabel}</span>
    </Badge>
  );
}
