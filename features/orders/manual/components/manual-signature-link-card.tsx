"use client";

import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyTextWithFeedback } from "@/features/orders/utils";

type CopyTarget = "inline" | "trailing";

type CopySignatureLinkButtonProps = {
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopy: () => void;
  className: string;
  iconClassName: string;
};

function CopySignatureLinkButton({
  label,
  open,
  onOpenChange,
  onCopy,
  className,
  iconClassName,
}: CopySignatureLinkButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCopy}
            aria-label={label}
            className={className}
          >
            <Copy className={iconClassName} strokeWidth={1.75} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type ManualSignatureLinkCardProps = {
  /** Public signature URL shared with the employer and the worker. */
  link: string;
  className?: string;
};

export default function ManualSignatureLinkCard({
  link,
  className,
}: ManualSignatureLinkCardProps) {
  const t = useTranslations("Orders.Manual.documents");
  const [copied, setCopied] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<CopyTarget | null>(null);

  const copyLabel = copied ? t("copied") : t("copySignatureLink");

  const handleCopy = (source: CopyTarget) => {
    const trimmed = link.trim();
    if (!trimmed) return;

    void copyTextWithFeedback(trimmed, {
      setCopied,
      setTooltipOpen: (open) => setOpenTooltip(open ? source : null),
    });
  };

  const handleTooltipOpenChange =
    (source: CopyTarget) => (nextOpen: boolean) => {
      if (copied) return;
      setOpenTooltip(nextOpen ? source : null);
    };

  return (
    <Field className={className}>
      <FieldLabel className="gap-1">
        {t("signatureLink")}
        <span aria-hidden className="text-brand-accent">
          *
        </span>
      </FieldLabel>
      <div className="flex items-center gap-3 rounded-2xl border border-brand-primary/10 bg-brand-background/50 px-4 py-3">
        <CustomIcon
          src="/svg/link.svg"
          size={20}
          className="shrink-0 text-brand-gris"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-brand-gris">
            {t("signatureLinkLabel")}
          </p>
          <div className="flex min-w-0 items-center gap-1.5">
            <p
              className="truncate text-sm font-semibold text-brand-black"
              dir="ltr"
            >
              {link}
            </p>
            <CopySignatureLinkButton
              label={copyLabel}
              open={openTooltip === "inline"}
              onOpenChange={handleTooltipOpenChange("inline")}
              onCopy={() => handleCopy("inline")}
              className="size-6 shrink-0 rounded-md text-brand-gris hover:bg-brand-primary/10 hover:text-brand-primary"
              iconClassName="size-3.5"
            />
          </div>
        </div>
        <CopySignatureLinkButton
          label={copyLabel}
          open={openTooltip === "trailing"}
          onOpenChange={handleTooltipOpenChange("trailing")}
          onCopy={() => handleCopy("trailing")}
          className="size-9 shrink-0 rounded-full text-brand-gris hover:bg-brand-primary/10 hover:text-brand-primary"
          iconClassName="size-4"
        />
      </div>
    </Field>
  );
}
