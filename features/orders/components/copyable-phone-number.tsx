"use client";

import { Copy, Phone } from "lucide-react";
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

type CopyablePhoneNumberProps = {
  phone: string;
  className?: string;
};

export function CopyablePhoneNumber({
  phone,
  className,
}: CopyablePhoneNumberProps) {
  const t = useTranslations("Orders.Common");
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = () => {
    if (!phone || phone === "—") return;
    void copyTextWithFeedback(phone, {
      setCopied,
      setTooltipOpen,
    });
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-brand-gris",
        className
      )}
    >
      <Phone className="size-3.5 shrink-0" strokeWidth={1.75} />
      <span dir="ltr" className="font-clash">{phone}</span>
      {phone && phone !== "—" && (
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
                aria-label={copied ? t("copied") : t("copyPhone")}
                className="inline-flex size-5 items-center justify-center rounded text-brand-gris transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
              >
                <Copy className="size-3" strokeWidth={1.75} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
              <p>{copied ? t("copied") : t("copyPhone")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
