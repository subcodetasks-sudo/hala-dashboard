"use client";

import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyTextWithFeedback } from "@/lib/copy-to-clipboard";
import { cn } from "@/lib/utils";

type CopyableEmployeeNumberProps = {
  employeeNumber: string;
  className?: string;
};

export function CopyableEmployeeNumber({
  employeeNumber,
  className,
}: CopyableEmployeeNumberProps) {
  const t = useTranslations("Employees.Common");
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = () => {
    if (!employeeNumber || employeeNumber === "—") return;
    void copyTextWithFeedback(employeeNumber, {
      setCopied,
      setTooltipOpen,
    });
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span dir="ltr" className="font-clash">{employeeNumber}</span>
      {employeeNumber && employeeNumber !== "—" && (
        <TooltipProvider>
          <Tooltip
            open={tooltipOpen}
            onOpenChange={(nextOpen) => {
              if (copied) return;
              setTooltipOpen(nextOpen);
            }}
          >
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? t("copied") : t("copyEmployeeNumber")}
                className="inline-flex size-5 items-center justify-center rounded text-brand-gris transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
              >
                <Copy className="size-3" strokeWidth={1.75} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
              <p>{copied ? t("copied") : t("copyEmployeeNumber")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
