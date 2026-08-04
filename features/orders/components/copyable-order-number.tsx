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

type CopyableOrderNumberProps = {
  orderNumber: string;
  className?: string;
};

export function CopyableOrderNumber({
  orderNumber,
  className,
}: CopyableOrderNumberProps) {
  const t = useTranslations("Orders.Common");
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = () => {
    if (!orderNumber || orderNumber === "—") return;
    void copyTextWithFeedback(orderNumber, {
      setCopied,
      setTooltipOpen,
    });
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span dir="ltr" className="font-clash">{orderNumber}</span>
      {orderNumber && orderNumber !== "—" && (
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
                aria-label={copied ? t("copied") : t("copyOrderNumber")}
                className="inline-flex size-5 items-center justify-center rounded text-brand-gris transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
              >
                <Copy className="size-3" strokeWidth={1.75} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
              <p>{copied ? t("copied") : t("copyOrderNumber")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
