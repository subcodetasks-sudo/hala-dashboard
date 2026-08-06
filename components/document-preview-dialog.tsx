"use client";

import { Download, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const MIN_IMAGE_SCALE = 1;
const MAX_IMAGE_SCALE = 4;
const IMAGE_ZOOM_STEP = 0.25;

function clampImageScale(value: number): number {
  return Math.min(MAX_IMAGE_SCALE, Math.max(MIN_IMAGE_SCALE, value));
}

export function isDocumentPdfSource({
  src,
  fileName,
  mimeType,
  format,
}: {
  src: string;
  fileName?: string;
  mimeType?: string;
  format?: string;
}): boolean {
  if (mimeType === "application/pdf") return true;
  if (format?.trim().toLowerCase() === "pdf") return true;

  const candidates = [fileName, src]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.toLowerCase());

  return candidates.some(
    (value) => value.endsWith(".pdf") || value.includes(".pdf?")
  );
}

function resolveDownloadFileName({
  fileName,
  title,
  isPdf,
  mimeType,
  format,
}: {
  fileName?: string;
  title: string;
  isPdf: boolean;
  mimeType?: string;
  format?: string;
}): string {
  if (fileName?.trim()) return fileName.trim();

  const base = title.trim() || "document";
  if (isPdf) {
    return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
  }

  if (base.includes(".")) return base;

  const extension =
    format?.trim().toLowerCase() ||
    mimeType?.split("/")[1]?.split("+")[0] ||
    "png";

  return `${base}.${extension}`;
}

function downloadDocument(
  src: string,
  downloadName: string,
  { openInNewTab = false }: { openInNewTab?: boolean } = {},
): void {
  if (openInNewTab) {
    window.open(src, "_blank", "noopener,noreferrer");

    void fetch(src)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Download failed");
        }
        return response.blob();
      })
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = downloadName;
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      })
      .catch(() => {
        // Preview is already open in the new tab; avoid navigating this page.
      });

    return;
  }

  const link = document.createElement("a");
  link.href = src;
  link.download = downloadName;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printDocument({
  src,
  title,
  isPdf,
  pdfFrame,
}: {
  src: string;
  title: string;
  isPdf: boolean;
  pdfFrame: HTMLIFrameElement | null;
}): void {
  if (isPdf && pdfFrame?.contentWindow) {
    pdfFrame.contentWindow.focus();
    pdfFrame.contentWindow.print();
    return;
  }

  const frame = document.createElement("iframe");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);

  const doc = frame.contentDocument ?? frame.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(frame);
    return;
  }

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
  <head><title>${title}</title></head>
  <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
    <img src="${src}" alt="${title}" style="max-width:100%;max-height:100vh;object-fit:contain;" />
  </body>
</html>`);
  doc.close();

  const image = doc.querySelector("img");
  const triggerPrint = () => {
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    window.setTimeout(() => {
      if (frame.parentNode) {
        document.body.removeChild(frame);
      }
    }, 1000);
  };

  if (image?.complete) {
    triggerPrint();
  } else {
    image?.addEventListener("load", triggerPrint, { once: true });
  }
}

type ZoomableImageViewerProps = {
  src: string;
  alt: string;
};

export function ZoomableImageViewer({ src, alt }: ZoomableImageViewerProps) {
  const t = useTranslations("Common.DocumentPreview");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomBy = (delta: number) => {
    setScale((previous) => {
      const next = clampImageScale(previous + delta);
      if (next <= MIN_IMAGE_SCALE) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY < 0 ? IMAGE_ZOOM_STEP : -IMAGE_ZOOM_STEP;
      setScale((previous) => {
        const next = clampImageScale(previous + delta);
        if (next <= MIN_IMAGE_SCALE) {
          setPosition({ x: 0, y: 0 });
        }
        return next;
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (scale <= MIN_IMAGE_SCALE) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPosition({
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className={cn(
          "flex h-[70vh] w-full touch-none items-center justify-center overflow-hidden rounded-2xl bg-brand-background/60",
          scale > MIN_IMAGE_SCALE
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-zoom-in"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => {
          if (scale > MIN_IMAGE_SCALE) {
            resetView();
            return;
          }
          zoomBy(IMAGE_ZOOM_STEP * 2);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- supports blob: and remote document URLs */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="max-h-full max-w-full select-none object-contain transition-transform duration-75 will-change-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-black/5 bg-white/95 p-1 shadow-sm">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("zoomOut")}
            disabled={scale <= MIN_IMAGE_SCALE}
            onClick={() => zoomBy(-IMAGE_ZOOM_STEP)}
            className="size-8 rounded-full text-brand-gris hover:bg-brand-background hover:text-brand-black disabled:opacity-40"
          >
            <ZoomOut className="size-4" strokeWidth={2} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("resetZoom")}
            disabled={
              scale <= MIN_IMAGE_SCALE && position.x === 0 && position.y === 0
            }
            onClick={resetView}
            className="size-8 rounded-full text-brand-gris hover:bg-brand-background hover:text-brand-black disabled:opacity-40"
          >
            <RotateCcw className="size-3.5" strokeWidth={2} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("zoomIn")}
            disabled={scale >= MAX_IMAGE_SCALE}
            onClick={() => zoomBy(IMAGE_ZOOM_STEP)}
            className="size-8 rounded-full text-brand-gris hover:bg-brand-background hover:text-brand-black disabled:opacity-40"
          >
            <ZoomIn className="size-4" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  );
}

type DocumentPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  src: string;
  /** Force PDF mode. When omitted, inferred from src / fileName / mimeType / format. */
  isPdf?: boolean;
  fileName?: string;
  mimeType?: string;
  format?: string;
};

export default function DocumentPreviewDialog({
  open,
  onOpenChange,
  title,
  src,
  isPdf: isPdfProp,
  fileName,
  mimeType,
  format,
}: DocumentPreviewDialogProps) {
  const t = useTranslations("Common.DocumentPreview");
  const pdfFrameRef = useRef<HTMLIFrameElement>(null);
  const isPdf =
    isPdfProp ??
    isDocumentPdfSource({ src, fileName, mimeType, format });

  const downloadName = resolveDownloadFileName({
    fileName,
    title,
    isPdf,
    mimeType,
    format,
  });

  const handleDownload = () => {
    downloadDocument(src, downloadName, { openInNewTab: !isPdf });
  };

  const handlePrint = () => {
    printDocument({
      src,
      title,
      isPdf,
      pdfFrame: pdfFrameRef.current,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-60 bg-black/60 supports-backdrop-filter:backdrop-blur-sm"
        className="z-60 gap-0 overflow-hidden rounded-[1.75rem] border-none bg-white p-0 ring-0 sm:max-w-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <DialogTitle className="min-w-0 truncate text-base font-bold text-brand-black">
            {title}
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
        <DialogDescription className="sr-only">{t("viewDocument")}</DialogDescription>
        <div className="max-h-[75vh] bg-brand-background/60 p-4">
          {isPdf ? (
            <iframe
              ref={pdfFrameRef}
              src={src}
              title={title}
              className="h-[70vh] w-full rounded-2xl bg-white"
            />
          ) : open ? (
            <ZoomableImageViewer src={src} alt={title} />
          ) : null}
        </div>

        <div className="flex gap-3 border-t border-black/10 px-5 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleDownload}
            className="h-12 flex-1 gap-2 rounded-2xl bg-brand-black/5 px-5 font-semibold text-brand-gris hover:bg-brand-black/5 hover:text-brand-black/70"
          >
            <Download className="size-4" strokeWidth={1.75} />
            <span>{t("download")}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrint}
            className="h-12 flex-1 gap-2 rounded-2xl bg-brand-black/5 px-5 font-semibold text-brand-gris hover:bg-brand-black/5 hover:text-brand-black/70"
          >
            <CustomIcon src="/svg/print.svg" size={20} />
            <span>{t("print")}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
