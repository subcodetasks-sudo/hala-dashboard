"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type ContractQrCodeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Absolute or relative URL encoded into the QR (contract / final contract link). */
  contractLink: string | null;
};

function toAbsoluteUrl(link: string): string {
  const trimmed = link.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (typeof window === "undefined") return trimmed;
  try {
    return new URL(trimmed, window.location.origin).href;
  } catch {
    return trimmed;
  }
}

export default function ContractQrCodeDialog({
  open,
  onOpenChange,
  contractLink,
}: ContractQrCodeDialogProps) {
  const t = useTranslations("Orders.New.Review.contractQrCodeDialog");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!open || !contractLink?.trim()) {
      setQrDataUrl(null);
      setHasError(false);
      setIsGenerating(false);
      return;
    }

    let cancelled = false;
    const absoluteLink = toAbsoluteUrl(contractLink);

    setIsGenerating(true);
    setHasError(false);

    void QRCode.toDataURL(absoluteLink, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#141414",
        light: "#FFFFFF",
      },
    })
      .then((dataUrl) => {
        if (cancelled) return;
        setQrDataUrl(dataUrl);
        setIsGenerating(false);
      })
      .catch(() => {
        if (cancelled) return;
        setQrDataUrl(null);
        setHasError(true);
        setIsGenerating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, contractLink]);

  const showUnavailable = !contractLink?.trim() || hasError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="gap-0 overflow-hidden rounded-[1.75rem] border-none bg-white p-6 ring-0 sm:max-w-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <DialogTitle className="text-base font-bold text-brand-black">
            {t("title")}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label={t("close")}
              className="size-9 shrink-0 rounded-xl bg-brand-background p-0 text-brand-gris hover:bg-brand-background/80 hover:text-brand-black"
            >
              <X className="size-4" strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        <DialogDescription className="sr-only">{t("description")}</DialogDescription>

        <div className="flex flex-col items-center justify-center gap-4 px-5 py-8">
          {isGenerating ? (
            <div className="flex size-48 items-center justify-center rounded-2xl border border-black/10 bg-brand-background/50">
              <p className="text-sm font-medium text-brand-gris">{t("generating")}</p>
            </div>
          ) : qrDataUrl ? (
            <div className="flex size-48 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt={t("title")}
                className="size-full object-contain"
              />
            </div>
          ) : showUnavailable ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CustomIcon
                src="/svg/scan.svg"
                size={40}
                className="text-brand-gris"
              />
              <p className="text-sm font-medium text-brand-gris">
                {t("unavailable")}
              </p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
